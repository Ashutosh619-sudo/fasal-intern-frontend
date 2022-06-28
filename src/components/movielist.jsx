import React, { useState } from "react";
import { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import List from "../components/list.jpg"
import {
  Container,
  NavDropdown,
  Nav,
  Form,
  FormControl,
  Button,
  Navbar,
  Card,
  Modal,
  Table,
  Row,
  Col,
  Image,
  Dropdown,
  DropdownButton,
  Alert
} from "react-bootstrap";
import API_URL from "./constant";

const MovieList = () => {
  const [show, setShow] = useState(false);
  const [check,setCheck]=useState(false)

  const handleClose = () => setShow2(false);

  const { id } = useParams()
  const navigate = useNavigate()
  const handleShow = (id) => {

    navigate(`/movie-list/${id}`)

  };

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => {
    createMovieList()
    setShow2(false)
  };
  const handleShow2 = () => setShow2(true);

  const [errorMessage, setErrorMessage] = useState("")
  const [emptyMessage, setEmptyMessage] = useState("")

  const [movieList, setMovieList] = useState([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")


  async function getMovieList() {
    const user_data = JSON.parse(localStorage.getItem("user_data"))
    if (user_data) {
      const token = user_data.token
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }
      }

      const url = API_URL+'movie/movie-list/'
      const res = await fetch(url, requestOptions)
      const data = await res.json()
      console.log(data.status)
      if (res.status == 200) {

        if (data.length == 0) {
          console.log("empty")
          setEmptyMessage("You dont have any movie list please create one!")
        }
        else {
          setMovieList(data)
        }
      }
    }
    else {
      setErrorMessage("Please Login First")
    }
  }

  async function createMovieList() {
    const user_data = JSON.parse(localStorage.getItem("user_data"))
    if (user_data) {
      const token = user_data.token
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify({ name: name, description: description, private: check, user: user_data.user_id })
      }
      const url = API_URL+"movie/movie-list/"
      const res = await fetch(url, requestOptions)
      const data = await res.json()
      console.log(res.status)
      if (res.status === 201) {
        await getMovieList()
      }
    }
  }

  useEffect(() => {
    async function fetchMovieList() {
      await getMovieList()
    }

    fetchMovieList()
  }, [])

  return (
    <><Navbar bg="dark" variant="dark" expand="lg">
    <Container >
      <Navbar.Brand href="/">Fasal</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
        <Nav
          className="me-auto my-2 my-lg-0"
          style={{ maxHeight: "100px" }}
          navbarScroll
        >
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/movie-list">
            Your Movie List
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
      {
        errorMessage ?<h1 className="p-5 m-5" style={{
          textAlignLast: "center",
  
        }}>{errorMessage}</h1> : (<><div className="m-5 p-1">
          <Button onClick={handleShow2} variant="primary">Create Movie List</Button>
        </div>
          {emptyMessage ? <h1 className="p-5 m-5" style={{
        textAlignLast: "center",

      }}>{emptyMessage}</h1> : <div className="ml-5 p-5" style={{ display: "inline-flex" }}>

            {movieList.map(item => (
              <Card
                key={item.id}
                style={{ width: "15rem" }}
                className="m-3"
                
              >
                <Card.Img variant="top" src={List} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    {item.description}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleShow(item.id)} >Movie List</Button>
                </Card.Body>
                
              </Card>
            ))}


          </div>}
        </>)
      }


      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Create List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Movie List Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter List Name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Movie List Description</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
          </Form>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Private"
              checked={check}
              onChange={()=>{setCheck(!check)}}
              
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose2}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default MovieList;
