import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isEmployer: false,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password, isEmployer } = formData;

  const onChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`/api/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isEmployer', isEmployer);
      navigate(`/`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error during registration');
    }
  };

  return (
    <>
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mt-2">
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

        <Form.Group controlId="formIsEmployer" className="mt-2">
          <Form.Check
            type="checkbox"
            label="I am an Employer"
            name="isEmployer"
            checked={isEmployer}
            onChange={onChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-2">
          Register
        </Button>
      </Form>
    </>
  );
};

export default Register;
