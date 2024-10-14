import React from 'react'
import Card from 'react-bootstrap/Card';
import { useDraggable } from '@dnd-kit/core';
function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  console.log(task)
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: 'grab',
    margin: "8px"
  };
  return (
    <>
      { Object.keys(task).length >0 ? (
        <div style={style} ref={setNodeRef} {...listeners} {...attributes}>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>{task.task}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
              <Card.Text>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <></>
      )}

    </>
  )
}

export default TaskCard