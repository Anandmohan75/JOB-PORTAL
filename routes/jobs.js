const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const Job = require('../models/job');
const User = require('../models/user');
const Application = require('../models/application');

// const baseUrl = process.env.BASE_URL;
router.post(
  `/`,
  [
    auth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('company').not().isEmpty().withMessage('Company is required'),
    body('location').not().isEmpty().withMessage('Location is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, company, location } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user.isEmployer) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const newJob = new Job({
        title,
        description,
        company,
        location,
        postedBy: req.user.id,
      });

      const job = await newJob.save();
      res.json(job);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get(`/`, async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', ['name', 'email']);
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get(`/:id/applications`, auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.id }).populate('user', ['name', 'email']);
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put(`/application/:appId`, auth, async (req, res) => {
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const application = await Application.findById(req.params.appId);
    if (!application) return res.status(404).json({ msg: 'Application not found' });

    const job = await Job.findById(application.job);
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get(`/:id`, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', ['name', 'email']);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Job not found' });
    res.status(500).send('Server Error');
  }
});


router.put(`/:id`, auth, async (req, res) => {
  const { id } = req.params;
  const { title, company, location, description } = req.body;

  try {
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });


    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.description = description || job.description;

    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get(`/test`, auth, (req, res) => {
  res.send('Middleware is working');
});

router.delete(`/:id`, auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const user = await User.findById(req.user.id);
    if (job.postedBy.toString() !== req.user.id && !user.isEmployer) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await job.remove();
    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;


