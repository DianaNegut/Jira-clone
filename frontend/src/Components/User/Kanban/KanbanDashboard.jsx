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

  useEffect(() => {
    const fetchTeamTasksAndMembers = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          throw new Error('Nu ești autentificat');
        }
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

        // Fetch tasks for the selected team
        const tasksResponse = await fetch(`http://localhost:4000/api/teams/${selectedTeamId}/tasks`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!tasksResponse.ok) {
          throw new Error('Eroare la obținerea task-urilor echipei');
        }

        const tasksData = await tasksResponse.json();
        organizeTasksByStatus(tasksData.data.tasks);

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

  const organizeTasksByStatus = (tasks) => {
    const newColumns = {
      unassigned: { name: 'Neatribuite', items: [] },
      assignToMe: { name: 'ATRIBUIE MIE', items: [] },
      assignToColleague: { name: 'ATRIBUIE UNUI COLEG', items: [] }
    };

    tasks.forEach(task => {
      const taskItem = {
        id: task._id,
        content: `${task.title} - ${task.description}`,
        status: task.status,
        assignedTo: task.assignedTo,
        timeLogged: task.time_logged
      };

      switch (task.status) {
        case 'unassigned':
          newColumns.unassigned.items.push(taskItem);
          break;
        case 'in progress':
          newColumns.assignToMe.items.push(taskItem); // Map "in progress" to "ATRIBUIE MIE"
          break;
        case 'completed':
          newColumns.assignToColleague.items.push(taskItem); // Map "completed" to "ATRIBUIE UNUI COLEG"
          break;
        default:
          newColumns.unassigned.items.push(taskItem);
      }
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
    if (columnId === 'assignToMe') {
      // Save changes to the database
      await saveTaskUpdates(columns.assignToMe.items, 'in progress');
      alert('Taskurile au fost atribuite ție cu succes!');
    } else if (columnId === 'assignToColleague') {
      if (!selectedColleague) {
        alert('Te rugăm să selectezi un coleg!');
        return;
      }

      const colleague = teamMembers.find(member => member._id === selectedColleague);
      if (colleague) {
        await saveTaskUpdates(columns.assignToColleague.items, 'completed', selectedColleague);
        alert(`Taskurile au fost atribuite lui ${colleague.name} cu succes!`);
      } else {
        alert('Colegul selectat nu a fost găsit!');
      }
    }
  };

  const saveTaskUpdates = async (tasks, status, assignedTo = null) => {
    try {
      const updates = tasks.map(task => ({
        id: task.id,
        status,
        assignedTo
      }));

      const response = await fetch('http://localhost:4000/api/tasks/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ tasks: updates }),
      });

      if (!response.ok) {
        throw new Error('Eroare la salvarea modificărilor');
      }
    } catch (error) {
      console.error('Eroare la salvarea task-urilor:', error);
      alert('Eroare la salvarea modificărilor');
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
              disabled={column.items.length === 0}
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
