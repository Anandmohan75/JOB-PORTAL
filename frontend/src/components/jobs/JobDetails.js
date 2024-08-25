import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);
      setJob(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error fetching job details');
      setLoading(false);
    }
  };

  const navigate=useNavigate();
  const applyForJob = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to apply for the job');
      setTimeout(() => {
        navigate("/");
      }, 2000);

      
      return;
    }

    if (hasApplied) {
      setError('You have already applied for this job');
      return;
    }

    try {
      await axios.post(
        `/api/applications/apply/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplicationStatus('Application submitted successfully');
      setHasApplied(true);
    } catch (err) {
      console.error(err.response.data.msg);
      setError(err.response.data.msg);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (!job) {
    return <Alert variant="danger">Job not found</Alert>;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>{job.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {job.company} - {job.location}
        </Card.Subtitle>
        <Card.Text>{job.description}</Card.Text>
        {error && <Alert variant="danger">{error}</Alert>}
        {applicationStatus && <Alert variant="success">{applicationStatus}</Alert>}
        {hasApplied ? (
          <Button variant="secondary" disabled>
            Applied
          </Button>
        ) : (
          <Button variant="primary" onClick={applyForJob}>
            Apply Now
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default JobDetails;
