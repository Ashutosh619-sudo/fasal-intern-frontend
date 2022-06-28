import React, { useState } from "react";
import { useEffect } from "react";
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
import Movie from "./movie.jpg";
import API_URL from "./constant";

const Home = () => {
  const apiKey = "1642c235"
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({})

  const handleClose = () => {
    setShow(false)
    setModalData({})

  }
  const handleShow = (data) => {
    setShow(true)
    getDetailedMovie(data)
  }

  const [search, setSearch] = useState("")
  const [movieData, setMovieData] = useState([])
  const [movieListData, setMovieListData] = useState([])
  const [message, setMessage] = useState("")

  const [addedMovieId, setAddedMovieId] = useState("")


  async function searchMovie(e) {
    e.preventDefault()
    const url = `http://www.omdbapi.com/?s=${search}&apikey=${apiKey}&`
    const res = await fetch(url)
    const data = await res.json()

    let tempMovieData = []
    if (data["Search"] != undefined) {
      data["Search"].forEach(item => {
        tempMovieData.push(item)
      })
    }

    console.log(tempMovieData)
    setMovieData(tempMovieData)
    console.log(movieData)
  }

  async function getDetailedMovie(data) {
    const url = `http://www.omdbapi.com/?i=${data.imdbID}&apikey=${apiKey}&`
    const res = await fetch(url)
    const res_data = await res.json()

    setModalData(res_data)
  }

  async function getMovieList() {
    const user_data = JSON.parse(localStorage.getItem("user_data"))
    if (user_data) {
      const token = user_data.token
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }
      }

      const url = API_URL + 'movie/movie-list/'
      const res = await fetch(url, requestOptions)
      const data = await res.json()
      console.log(data.status)
      if (res.status == 200) {

        setMovieListData(data)

      }
    }
  }

  async function selectMovieList(data) {
    await addToMovieList(data)

  }

  async function addToMovieList(postData) {
    postData = JSON.parse(postData)
    setAddedMovieId(postData.imdbID)
    let url = `http://www.omdbapi.com/?i=${postData.imdbID}&apikey=${apiKey}&`
    let res = await fetch(url)
    let res_data = await res.json()
    res_data = { ...res_data, movieList: postData.movieList, Poster: postData.Poster }
    const user_data = JSON.parse(localStorage.getItem("user_data"))
    if (user_data) {
      const token = user_data.token
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify(res_data)
      }

      url = API_URL + 'movie/add-to-list/'
      res = await fetch(url, requestOptions)
      const data = await res.json()
      if (res.status == 201) {
        setMessage("Success fully added Movie to your List")
      }
      else {
        setMessage(data["data"])
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
            <Form className="d-flex" onSubmit={searchMovie}>
              <FormControl

                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={e => setSearch(e.target.value)}
              />
              <Button variant="outline-success" onClick={searchMovie} >Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>



      {movieData.length == 0 ? <h1 className="p-5 m-5" style={{
        textAlignLast: "center",

      }}>Search and add movies to your list</h1> : null}

      {movieData.map(item => {
        return <div key={item.imdbID} style={{ display: "inline-flex" }} className="mx-5 mt-5 p-5">
          <Card style={{ width: "18rem" }} >
            <Card.Img variant="top" src={item.Poster} onClick={(e) => (handleShow(item))} />
            <Card.Body>
              <Card.Title>{item.Title}</Card.Title>
              <DropdownButton id="dropdown-basic-button" title="Add Movie to List" onSelect={selectMovieList}>
                {movieListData.map(movieListItem => (
                  <Dropdown.Item key={movieListItem["id"]} eventKey={JSON.stringify({ ...item, movieList: movieListItem["id"], Poster: item.Poster })}>{movieListItem["name"]}</Dropdown.Item>
                ))}
              </DropdownButton>
              {message && addedMovieId==item.imdbID  ? <Alert style={{marginTop:"20px"}} variant='danger'>
                {message}
              </Alert> : null}
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
};

export default Home;
