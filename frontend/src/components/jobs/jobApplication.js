import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JobApplications = () => {
    const { id } = useParams(); 
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchApplications = async () => {
        try {
          const res = await axios.get(`/api/jobs/${id}/applications`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setApplications(res.data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Error fetching applications');
          setLoading(false);
        }
      };
  
      fetchApplications();
    }, [id]);

  const handleDecision = async (appId, decision) => {
    try {
      await axios.put(
        `/api/jobs/application/${appId}`,
        { status: decision },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setApplications(applications.map(app => 
        app._id === appId ? { ...app, status: decision } : app
      ));
    } catch (err) {
      console.error(err);
      setError('Error updating application status');
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h2>Job Applications</h2>
      {applications.map((application) => (
        <Card key={application._id} className="mb-3">
          <Card.Body>
            <Card.Title>{application.user.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{application.user.email}</Card.Subtitle>
            <Card.Text>Status: {application.status}</Card.Text>
            {application.status === 'pending' && (
              <>
                <Button variant="success" onClick={() => handleDecision(application._id, 'accepted')}>
                  Accept
                </Button>
                <Button variant="danger" onClick={() => handleDecision(application._id, 'rejected')}>
                  Reject
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}
    </>
  );
};


export default JobApplications;
