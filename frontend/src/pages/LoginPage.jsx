import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors before attempting login

    try {
      await login(email, password);
      navigate('/'); // Redirect to the homepage after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="w-50 border p-4 rounded shadow-sm" style={{ backgroundColor: 'white', borderWidth: '2px', borderColor: '#ddd' }}>
        <h1 className="text-center mb-4">Login</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ height: '45px' }}
            />
          </Form.Group>

          <Form.Group className="mb-3 position-relative" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ height: '45px', paddingRight: '50px' }}
            />
            <Button
              variant="link"
              className="position-absolute end-0 top-50 translate-middle-x"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{ background: 'none', border: 'none', right: '10px' }}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </Button>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Login
          </Button>
          <p className="text-center">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </Form>
      </div>
    </Container>
  );
}

export default LoginPage;
