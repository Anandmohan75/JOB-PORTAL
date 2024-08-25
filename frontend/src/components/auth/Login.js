import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`/api/auth/login`, formData);
      const token = res.data.token;

      if (!token) {
        throw new Error('Login failed, no token received.');
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      const isEmployer = decodedToken?.user?.isEmployer ?? false;

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isEmployer', isEmployer);

      navigate(`/`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <>
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-2">
          Login
        </Button>
      </Form>
    </>
  );
};

export default Login;
