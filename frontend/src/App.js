import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, positi} from 'react-bootstrap';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JobList from './components/jobs/JobList';
import JobDetails from './components/jobs/JobDetails';
import CreateJob from './components/jobs/CreateJob';
import JobEditForm from './components/jobs/jobEditForm';
import JobApplications from './components/jobs/jobApplication';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <Navbar />
        <div className="container mt-4">
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs/edit/:id" element={<JobEditForm />} />
          <Route path="jobs/:id/applications" element={<JobApplications />} />

        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
