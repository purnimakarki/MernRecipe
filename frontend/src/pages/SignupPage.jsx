import React, { useState,useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors before attempting signup

    try {
      await signup(name,email,password);
      navigate('/'); // Redirect to home after successful signup
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="w-50 border p-4 rounded shadow-sm" style={{ backgroundColor: 'white', borderWidth: '2px', borderColor: '#ddd' }}>
        <h1 className="text-center mb-4">Signup</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ height: '45px' }} // Adjust height of input field
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ height: '45px' }} // Adjust height of input field
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ height: '45px' }} // Adjust height of input field
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Signup
          </Button>
          <p className="text-center">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </Form>
      </div>
    </Container>
  );
}

export default SignupPage