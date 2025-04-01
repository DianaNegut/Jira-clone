import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import './KanbanDashboard.css';
import { getCurrentUser } from '../../../utils/authUtils.js';

const KanbanDashboard = () => {
  const [columns, setColumns] = useState({
    unassigned: { name: 'Neatribuite', items: [] },
    assignToMe: { name: 'ATRIBUIE MIE', items: [] },
    assignToColleague: { name: 'ATRIBUIE UNUI COLEG', items: [] }
  });
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedColleague, setSelectedColleague] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchTeamTasksAndMembers = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          throw new Error('Nu ești autentificat');
        }
        setCurrentUser(user);
        console.log("User ID: ", user.id);

        // Fetch user's teams
        const teamsResponse = await fetch(`http://localhost:4000/api/teams/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!teamsResponse.ok) {
          throw new Error('Eroare la obținerea echipelor utilizatorului');
        }

        const teamsData = await teamsResponse.json();
        const userTeams = teamsData.teams;

        if (!userTeams || userTeams.length === 0) {
          throw new Error('Nu ai echipe asignate');
        }

        const selectedTeamId = userTeams[0]._id;
        setTeamId(selectedTeamId);

        // Fetch unassigned tasks for the selected team using the new endpoint
        const unassignedTasksResponse = await fetch(`http://localhost:4000/api/teams/${selectedTeamId}/unassigned-tasks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!unassignedTasksResponse.ok) {
          throw new Error('Eroare la obținerea task-urilor neasignate ale echipei');
        }

        const unassignedTasksData = await unassignedTasksResponse.json();
        organizeTasksByStatus(unassignedTasksData.data.unassignedTasks);

        // Fetch team members
        const membersResponse = await fetch(`http://localhost:4000/api/teams/${selectedTeamId}/members`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!membersResponse.ok) {
          throw new Error('Eroare la obținerea membrilor echipei');
        }

        const membersData = await membersResponse.json();
        setTeamMembers(membersData.members);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamTasksAndMembers();
  }, []);

  const organizeTasksByStatus = (unassignedTasks) => {
    const newColumns = {
      unassigned: { name: 'Neatribuite', items: [] },
      assignToMe: { name: 'ATRIBUIE MIE', items: [] },
      assignToColleague: { name: 'ATRIBUIE UNUI COLEG', items: [] }
    };

    // Toate task-urile din unassignedTasks sunt deja neasignate, le punem direct în coloana "Neatribuite"
    unassignedTasks.forEach(task => {
      const taskItem = {
        id: task._id,
        content: `${task.title} - ${task.description}`,
        status: task.status,
        assignedTo: task.assignedTo,
        timeLogged: task.time_logged
      };

      newColumns.unassigned.items.push(taskItem);
    });

    setColumns(newColumns);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const sourceColumnId = active.data.current.columnId;
    const destColumnId = over.id;

    if (sourceColumnId === destColumnId) return;

    const sourceItems = [...columns[sourceColumnId].items];
    const destItems = [...columns[destColumnId].items];

    const movedItemIndex = sourceItems.findIndex((item) => item.id === active.id);
    const [movedItem] = sourceItems.splice(movedItemIndex, 1);

    destItems.push(movedItem);

    setColumns({
      ...columns,
      [sourceColumnId]: { ...columns[sourceColumnId], items: sourceItems },
      [destColumnId]: { ...columns[destColumnId], items: destItems },
    });
  };

  const handleColleagueChange = (e) => {
    setSelectedColleague(e.target.value);
  };

  const handleSaveChanges = async (columnId) => {
    try {
      if (columnId === 'assignToMe') {
        if (!currentUser) {
          throw new Error('Nu ești autentificat');
        }
        
        // Verificăm dacă există task-uri în coloana "Atribuie mie"
        if (columns.assignToMe.items.length === 0) {
          alert('Nu există task-uri de atribuit ție');
          return;
        }
        
        // Folosim endpoint-ul specific pentru asignarea task-urilor
        const tasks = columns.assignToMe.items;
        const assignmentPromises = tasks.map(task => 
          assignTaskToUser(task.id, currentUser.id)
        );
        
        await Promise.all(assignmentPromises);
        
        // Actualizăm starea pentru a elimina task-urile asignate
        setColumns(prevColumns => ({
          ...prevColumns,
          assignToMe: { ...prevColumns.assignToMe, items: [] }
        }));
        
        alert('Taskurile au fost atribuite ție cu succes!');
      } else if (columnId === 'assignToColleague') {
        // Verificăm dacă a fost selectat un coleg
        if (!selectedColleague) {
          alert('Te rugăm să selectezi un coleg!');
          return;
        }
        
        // Verificăm dacă există task-uri în coloana "Atribuie unui coleg"
        if (columns.assignToColleague.items.length === 0) {
          alert('Nu există task-uri de atribuit colegului');
          return;
        }

        const colleague = teamMembers.find(member => member._id === selectedColleague);
        
        if (!colleague) {
          alert('Colegul selectat nu a fost găsit!');
          return;
        }
        
        // Folosim endpoint-ul specific pentru asignarea task-urilor către colegul selectat
        const tasks = columns.assignToColleague.items;
        console.log(`Atribuind ${tasks.length} task-uri către colegul: ${colleague.name} (${selectedColleague})`);
        
        const assignmentPromises = tasks.map(task => {
          console.log(`Atribuind task ${task.id} către ${selectedColleague}`);
          return assignTaskToUser(task.id, selectedColleague);
        });
        
        await Promise.all(assignmentPromises);
        
        // Actualizăm starea pentru a elimina task-urile asignate
        setColumns(prevColumns => ({
          ...prevColumns,
          assignToColleague: { ...prevColumns.assignToColleague, items: [] }
        }));
        
        alert(`Taskurile au fost atribuite lui ${colleague.name} cu succes!`);
      }
      
      // Reîncărcăm task-urile neasignate după asignare
      await refreshUnassignedTasks();
      
    } catch (error) {
      console.error('Eroare la salvarea task-urilor:', error);
      alert(`Eroare la salvarea modificărilor: ${error.message}`);
    }
  };

  const assignTaskToUser = async (taskId, userId) => {
    console.log(`Apelând API pentru a asigna task-ul ${taskId} utilizatorului ${userId}`);
    
    try {
      const response = await fetch(`http://localhost:4000/api/teams/tasks/${taskId}/assign/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la asignarea task-ului');
      }

      const result = await response.json();
      console.log(`Task-ul ${taskId} a fost asignat utilizatorului ${userId} cu succes:`, result);
      return result;
    } catch (error) {
      console.error(`Eroare la asignarea task-ului ${taskId} către utilizatorul ${userId}:`, error);
      throw error;
    }
  };

  const refreshUnassignedTasks = async () => {
    try {
      if (!teamId) return;
      
      const unassignedTasksResponse = await fetch(`http://localhost:4000/api/teams/${teamId}/unassigned-tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!unassignedTasksResponse.ok) {
        throw new Error('Eroare la reîncărcarea task-urilor neasignate');
      }

      const unassignedTasksData = await unassignedTasksResponse.json();
      
      // Actualizăm doar coloana de task-uri neasignate
      setColumns(prevColumns => ({
        ...prevColumns,
        unassigned: {
          ...prevColumns.unassigned,
          items: unassignedTasksData.data.unassignedTasks.map(task => ({
            id: task._id,
            content: `${task.title} - ${task.description}`,
            status: task.status,
            assignedTo: task.assignedTo,
            timeLogged: task.time_logged
          }))
        }
      }));
    } catch (error) {
      console.error('Eroare la reîncărcarea task-urilor:', error);
    }
  };

  const SortableItem = ({ id, content, columnId, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id,
      data: { columnId, index },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: activeId === id ? 0.3 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="task-card"
      >
        {content}
      </div>
    );
  };

  const Column = ({ columnId, column }) => {
    const { setNodeRef } = useDroppable({
      id: columnId,
    });

    return (
      <div ref={setNodeRef} className="column">
        <h2>{column.name}</h2>
        <SortableContext
          items={column.items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="task-list">
            {column.items.map((item, index) => (
              <SortableItem
                key={item.id}
                id={item.id}
                content={item.content}
                columnId={columnId}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
        
        {columnId === 'assignToColleague' && (
          <div className="column-action-container">
            <select 
              className="team-members-dropdown"
              value={selectedColleague}
              onChange={handleColleagueChange}
            >
              <option value="">Selectează un coleg</option>
              {teamMembers.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            <button 
              className="save-changes-button"
              onClick={() => handleSaveChanges(columnId)}
              disabled={column.items.length === 0 || !selectedColleague}
            >
              Salvează modificările
            </button>
          </div>
        )}
        
        {columnId === 'assignToMe' && (
          <div className="column-action-container">
            <button 
              className="save-changes-button"
              onClick={() => handleSaveChanges(columnId)}
              disabled={column.items.length === 0}
            >
              Salvează modificările
            </button>
          </div>
        )}
      </div>
    );
  };

  const activeItem = Object.values(columns)
    .flatMap((col) => col.items)
    .find((item) => item.id === activeId);

  if (loading) return <div className="loading">Se încarcă taskurile...</div>;
  if (error) return <div className="error">Eroare: {error}</div>;

  return (
    <div className="kanban-dashboard">
      <h1>Kanban Dashboard - Echipa {teamId || 'N/A'}</h1>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-columns">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column key={columnId} columnId={columnId} column={column} />
          ))}
        </div>
        <DragOverlay>
          {activeId && activeItem ? (
            <div className="task-card dragging">{activeItem.content}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanDashboard;