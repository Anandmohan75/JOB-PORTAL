import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { title, description, company, location } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to post a job');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`/api/jobs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      navigate(`/`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Create Job</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Job Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter job title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCompany" className="mt-2">
          <Form.Label>Company</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter company name"
            name="company"
            value={company}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLocation" className="mt-2">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter location"
            name="location"
            value={location}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription" className="mt-2">
          <Form.Label>Job Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter job description"
            name="description"
            value={description}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-2" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Create Job'}
        </Button>
      </Form>
    </>
  );
};

export default CreateJob;
