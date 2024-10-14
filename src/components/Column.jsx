import React from 'react'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core';
function Column({ column }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id, // Unique ID for the droppable area
  })
  return (
    <>
      <div style={{ padding: "10px", border: 'none', width: '300px' }} ref={setNodeRef}>
        <h2 className='text-light'>{column.name}</h2>
        <p className='text-light'>drag tasks here</p>
          {column.tasks?.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
      
      </div>
    </>
  )
}

export default Column