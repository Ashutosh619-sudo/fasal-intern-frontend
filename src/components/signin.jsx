import React from "react";
import { Container, Col, Row, Form, Button, Image, Alert } from "react-bootstrap";
import signin from "./signin.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "./constant";

const SignIn = () => {

  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const [message, setMessage] = useState(null)

  const navigate = useNavigate()

  async function login(e) {
    e.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    }
    const res = await fetch(API_URL + 'user/login/', requestOptions)
    if (res.status === 200) {
      const res_data = await res.json()
      localStorage.setItem("user_data", JSON.stringify(res_data))
      setMessage("Logged In successfully")
      navigate('/')
    }
    else if (res.status === 400) {
      const res_data = await res.json()
      setMessage(res_data["non_field_errors"][0])
    }

  }

  return (
    <Container>
      {message ? <Alert variant='danger'>
        {message}
      </Alert> : null}
      <Row>
        <Col className="mt-5 p-5">
          <h1>Sign In</h1>
          <h5 className="mt-2">Welcome back, please enter your details</h5>
          <Form onSubmit={login} className="mt-5">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </Form.Group>

            <div style={{ marginTop: "50px" }}>
              <Button variant="primary" type="submit">
                Login
              </Button>
              <Link style={{textDecoration:"none",border:"2px solid black", padding:"5px 10px 7px 10px",color:"black"}} className="m-5" to="/register">Register</Link>
            </div>
          </Form>
        </Col>
        <Col className="mt-5 p-5">
          <Image src={signin} height={400} />
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
