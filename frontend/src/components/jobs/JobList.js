import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to fetch jobs with token authentication
  const fetchJobs = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');

      // Check if token exists
      if (!token) {
        const res = await axios.get(`/api/jobs`);
        setJobs(res.data);
        // setError('No token found, please log in.');
        setLoading(false);
        return;
      }

      // Make the request to fetch jobs with the Authorization header
      const res = await axios.get(`/api/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const isEmployer = localStorage.getItem('isEmployer') === 'true';

  const handleEditClick = (jobId) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <h2>Job Listings</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {jobs.map((job) => (
        <Card className="mb-3" key={job._id}>
          <Card.Body>
            <Card.Title>{job.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {job.company} - {job.location}
            </Card.Subtitle>
            <Card.Text>{job.description.substring(0, 100)}...</Card.Text>
            {isEmployer ? (
              <Button onClick={() => handleEditClick(job._id)} variant="secondary">
                Edit
              </Button>
            ) : (
              <Button as={Link} to={`/jobs/${job._id}`} variant="primary">
                View Details
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default JobList;
