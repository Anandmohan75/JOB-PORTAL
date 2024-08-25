// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const auth = require('./middleware/auth');
const path = require('path');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet()); 
app.use(morgan('combined')); 

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

mongoose.connect(process.env.MONGODB_URI, {
 
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:',err));

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB disconnected through app termination');
    process.exit(0);
  });
});


app.get("/",(req, res)=>{
  app.use(express.static(path.resolve(__dirname, "frontend", "build")));
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
