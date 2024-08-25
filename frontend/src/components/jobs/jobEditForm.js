import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const JobEditForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Ensure this is not null or undefined
      if (!token) {
        setError('No token found, please log in.');
        return;
      }
      await axios.put(
        `/api/jobs/${id}`,
        job,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Job updated successfully');
      navigate(`/`); 
    }  catch (err) {
      console.error('Error details:', err.response?.data || err);
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else {
        setError('Error updating job');
      }
    }
}

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Edit Job</h2>
      {success && <Alert variant="success">{success}</Alert>}
      <Form.Group controlId="formTitle">
        <Form.Label>Job Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={job.title}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="formCompany">
        <Form.Label>Company</Form.Label>
        <Form.Control
          type="text"
          name="company"
          value={job.company}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="formLocation">
        <Form.Label>Location</Form.Label>
        <Form.Control 
          type="text"
          name="location"
          value={job.location}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={job.description}
          onChange={handleInputChange}
          rows={5}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Update Job
      </Button>
    </Form>
  );
};

export default JobEditForm;
