import { useEffect, useState } from "react";
import View from "./components/View";
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createBoard, fetchBoards } from "./todos/todoSlice";

function App() {
  const [isActive, setIsActive] = useState(); 
  const [boardId,setBoardId] = useState(1)
  // Sidebar state
  const [isOpen, setIsOpen] = useState(true);
  const [show, setShow] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const dispatch = useDispatch();

  // Fetch boards from the API
  useEffect(() => {
    dispatch(fetchBoards());
    isOpen ? document.getElementById("main").style.marginLeft = "280px" 
    : document.getElementById("main").style.marginLeft = "0";
  }, [dispatch]);

  // Handle input change
  const handleChange = (e) => {
    setNewBoardName(e.target.value);
  };

  // Add new board
  const addBoard = (e) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      dispatch(createBoard(newBoardName));
      setNewBoardName('');
      handleClose();
    } else {
      alert('Board name cannot be empty');
    }
  };

  // Sidebar navigation
  const openNav = () => {
    document.getElementById("mySidenav").style.width = "280px";
    document.getElementById("main").style.marginLeft = "280px";
    setIsOpen(true);
  };

  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    setIsOpen(false);
  };

  // Modal control
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    e.preventDefault(); // Prevent any default action
    setShow(true);
  };

  // Get boards from Redux
  const { boards, loading, error } = useSelector((state) => state.todos);
  console.log("====-----+++_____", boards)


  //
  const handleBoardId = (id)=>{
    setBoardId(id)
    setIsActive(id)
  }
  return (
    <>
      <div id="mySidenav" className="  d-flex flex-column align-items-center  sidenav" style={{ width: isOpen ? "280px" : "0", position: "fixed", zIndex: 1, height: "100%", backgroundColor: "#111", overflowX: "hidden", transition: "0.5s",}}>
        {loading && <p className="text-light">Loading...</p>}
        {error && <p className="text-light">Error: {error}</p>}
        {boards && boards.length > 0 ? (
          boards.map((board) => (
            <>
              <button className={`boardName ${isActive === board.id ? 'active' : ''} bg-black mb-3`} onClick={()=>handleBoardId(board.id)}>
                <h5 className="text-light " key={board.id}>{board.name}</h5>
              </button>
            </>
          ))
        ) : (
          <p>No boards</p>
        )}
        <a className="closebtn" style={{ cursor: 'pointer' }} onClick={closeNav}>&times;</a>
        <Button variant="light fw-normal" onClick={handleShow}>Add Boards</Button>
      </div>

      <div id="main" style={{ transition: "margin-left 0.5s", padding: "16px" }}>
        {isOpen ? <span style={{ fontSize: "30px", cursor: "pointer", display: 'none' }} onClick={openNav}>&#9776;</span> : <span style={{ fontSize: "30px", cursor: "pointer", display: 'inline' }} onClick={openNav}>&#9776;</span>}
        <h3 style={{ display: 'inline' }}>TaskNest</h3>
        <View boardId = {boardId} />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Add Boards</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Hiking"
            value={newBoardName}
            onChange={handleChange}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="dark" onClick={addBoard}>
            Add Board
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
