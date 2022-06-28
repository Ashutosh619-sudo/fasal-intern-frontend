import React from "react";
import { Container, Col, Row, Form, Button, Image,Alert } from "react-bootstrap";
import signup from "./signup.png"
import { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "./constant";

const SignUp = () => {

  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")

  const [message,setMessage] = useState(null)

  async function register(e) {
    e.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email,password: password})
    }
    const res = await fetch(API_URL+'user/register/',requestOptions)
    if (res.status === 200){
      const res_data = await res.json()
      const userData = res_data["data"]
      setMessage("SuccessFully registered!! and login")
    }
    else if(res.status === 400){
      setMessage("User Already exists!")
    }

  }
  

  return (
    <Container>
      {message?  <Alert variant='danger'>
      {message}
    </Alert>:null}
      <Row>
        <Col className="mt-5 p-5">
          <h1>Sign Up</h1>
          <h5 className="mt-2">Welcome back, please enter your details</h5>
          <Form onSubmit={register} className="mt-5">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={e=>setEmail(e.target.value)}/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
            </Form.Group>
            
            <div style={{ marginTop: "50px" }}>
              <Button variant="primary" type="submit">
                Register
              </Button>
              <Link style={{textDecoration:"none",border:"2px solid black", padding:"5px 10px 7px 10px",color:"black"}} className="m-5" to="/login">Login</Link>
            </div>
          </Form>
        </Col>
        <Col className="mt-5 p-5">
          <Image src={signup} height={500} />
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
