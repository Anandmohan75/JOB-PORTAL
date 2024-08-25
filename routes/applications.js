const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/job');
const APplication = require('../models/application');
const User = require('../models/user');

// const baseUrl = process.env.BASE_URL;
router.post(`/apply/:jobId`, auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    const existingApplication = await APplication.findOne({
      job: req.params.jobId,
      user: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    const application = new APplication({
      job: req.params.jobId,
      user: req.user.id,
    });

    await application.save();
    res.json({ msg: 'Application submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get(`/job/:jobId`, auth, async (req, res) => {
  const { jobId } = req.params;
  try {

    if (!jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'Invalid Job ID' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const user = await User.findById(req.user.id);
    if (!user.isEmployer || job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const applications = await Application.find({ job: jobId }).populate('applicant', ['name', 'email']);
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put(`/update/:applicationId`, auth, async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    
    if (!applicationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: 'Invalid Application ID' });
    }

    const application = await Application.findById(applicationId).populate('job');
    if (!application) return res.status(404).json({ msg: 'Application not found' });

    const user = await User.findById(req.user.id);
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    application.status = status;
    await application.save();

    res.json(application);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
