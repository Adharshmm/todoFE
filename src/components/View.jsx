import React, { useEffect } from 'react'
import Column from './Column'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../todos/todoSlice';
function View({ boardId }) {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('');
    const [selectedBoard, setSelectedBoard] = useState({});
    const boards = useSelector((state) => state.todos.boards);
    useEffect(() => {
        console.log('Boards:', boards); // Log the boards array
        console.log('Current Board ID:', boardId);

        const foundBoard = boards.find((b) => b.id === Number(boardId));
        
        console.log('Found Board:', foundBoard);
        if (foundBoard) {
            setSelectedBoard(foundBoard);
            setColumns(foundBoard.columns)
        } else {
            setSelectedBoard({}); // Reset if no board found
        }
    }, [boardId, boards]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [columns, setColumns] = useState([])
        

      // Handle form submission
  const handleSubmit = () => {
    if (title) {
     
      const newTask = {
        boardId:selectedBoard.id,
        task:title
      };
      console.log('2040=123=1=3=2=:',newTask)
      dispatch(createTask(newTask))
     
      setTitle('');

      // Close the modal
      handleClose();
    } else {
      alert('Please fill out all fields');
    }
  };


    const handleDragEnd = (event) => {
        console.log(event)
        const { active, over } = event;

        if (active && over) {
            const activeId = active.id;
            const overId = over.id;

            // Get the source and destination columns
            const sourceColumnIndex = columns.findIndex(column => column.tasks.some(task => task.id === activeId));
            const destinationColumnIndex = columns.findIndex(column => column.id === overId);

            if (sourceColumnIndex !== destinationColumnIndex) {
                const sourceColumn = columns[sourceColumnIndex];
                const destinationColumn = columns[destinationColumnIndex];

                // Find and remove the task from the source column
                const task = sourceColumn.tasks.find(t => t.id === activeId);
                const updatedSourceTasks = sourceColumn.tasks.filter(t => t.id !== activeId);

                // Add the task to the destination column
                const updatedDestinationTasks = [...destinationColumn.tasks, task];

                // Update the state with the new columns
                const updatedColumns = [...columns];
                updatedColumns[sourceColumnIndex] = { ...sourceColumn, tasks: updatedSourceTasks };
                updatedColumns[destinationColumnIndex] = { ...destinationColumn, tasks: updatedDestinationTasks };

                setColumns(updatedColumns);
            }
        }
    }


    return (
        <>

            <div className='d-flex align-items-center justify-content-between w-100 mt-3'>
                <h4>{selectedBoard ? selectedBoard.name : "Select a board to view the task"}</h4>
                <Button variant="dark" onClick={handleShow}>+ Add New Task</Button>{' '}
            </div>



            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                <div className='bg-dark row rounded-3 mt-3'>
                    <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
                        {columns.map((column) => (
                            <div className='col md-4' key={column.id}>
                                <Column column={column} />
                            </div>
                        ))}
                    </SortableContext>
                </div>
            </DndContext>



            {/* Modal */}
            <div>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="e.g Take Coffie Break"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='w-100' variant="dark" onClick={handleSubmit}>Create Task</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default View