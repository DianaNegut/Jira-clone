import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import './KanbanDashboard.css';

const initialColumns = {
  available: {
    name: 'Available Tasks',
    items: [
      { id: '1', content: 'Task 1: Design Homepage' },
      { id: '2', content: 'Task 2: Write API Docs' },
      { id: '3', content: 'Task 3: Test Login Feature' },
    ],
  },
  assigned: { name: 'Assigned', items: [] },
  inProgress: { name: 'In Progress', items: [] },
  done: { name: 'Done', items: [] },
};

const KanbanDashboard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [activeId, setActiveId] = useState(null);

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
      </div>
    );
  };

  
  const activeItem = Object.values(columns)
    .flatMap((col) => col.items)
    .find((item) => item.id === activeId);

  return (
    <div className="kanban-dashboard">
      <h1>Kanban Dashboard</h1>
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