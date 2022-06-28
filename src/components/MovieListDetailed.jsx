import React, { useState } from "react";
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


import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import API_URL from "./constant";

function MovieListDetailed() {

  const apiKey = "1642c235"
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({})

  const handleClose = ()=>{ 
    setShow(false)
    setModalData({})

  }
  const handleShow = (data) => {
    setShow(true)
    console.log(data)
    getDetailedMovie(data)
  }

  const {id} = useParams()


  const [search, setSearch] = useState("")
  const [movieData, setMovieData] = useState([])
  const [movieListData,setMovieListData] = useState([])
  const [message, setMessage] = useState("")

  async function getDetailedMovie(data){
    
    const url = `http://www.omdbapi.com/?i=${data.imdb_id}&apikey=${apiKey}&`
    const res = await fetch(url)
    const res_data = await res.json()
    
    setModalData(res_data)
  }


  async function getMovieList(){
    const user_data = JSON.parse(localStorage.getItem("user_data"))
    if (user_data){
      const token = user_data.token
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json','Authorization':`Token ${token}` }
      }

      const url = API_URL+`movie/get-movie-list/${id}`
      const res = await fetch(url,requestOptions)
      const data = await res.json()
      if(res.status === 200){
        setMovieData(data["data"]["movies"])
        if (data["data"]["movies"].length==0){
            setMessage("You dont have any movie in this list, add to see here")
        }
      }
      else{
        setMessage("You cannot access private movie lists")
      }
      
  }
}

  useEffect(()=>{
    async function fetchMovieList(){
        await getMovieList()
      }
  
      fetchMovieList()
  },[])

  return(
    <>
    <Navbar bg="dark" variant="dark" expand="lg">
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
      {message?<Alert variant='danger'>
      {message}
    </Alert>:null}

      {movieData.map(item => {
        return <div key={item.imdbID} style={{ display: "inline-flex" }} className="mx-5 mt-5 p-5">
          <Card style={{ width: "18rem" }} >
            <Card.Img variant="top" src={item.Poster} onClick={(e) => (handleShow(item))}/>
            <Card.Body>
              <Card.Title>{item.Title}</Card.Title>
              <Card.Text>{item.Plot}</Card.Text>  
            </Card.Body>
          </Card>
          
        </div>
      })}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {modalData.Title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col md>
                <Image src={modalData.Poster} />
              </Col>
              <Col>
                <h6>Title: {modalData.Title}</h6>
                <h6>Director: {modalData.Director}</h6>
                <h6>Year: {modalData.Year}</h6>
                <h6>Actors: {modalData.Actors}</h6>
                <h6>Plot: {modalData.Plot}</h6>
                <h6>Writer: {modalData.Writer}</h6>
              </Col>
            </Row>

          </Container>



        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MovieListDetailed