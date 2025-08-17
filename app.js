const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Workout = require('./models/workout');

dotenv.config();  // This will load your .env file variables

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files like CSS and JavaScript
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS view engine
app.set('view engine', 'ejs');

// Home route - Displays all workouts
app.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.render('index', { workouts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Add a new workout
app.get('/workout/new', (req, res) => {
  res.render('workout');
});

app.post('/workout', async (req, res) => {
  const { exercise, sets, reps, weight } = req.body;
  
  try {
    const newWorkout = new Workout({
      exercise,
      sets,
      reps,
      weight,
    });
    
    await newWorkout.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
