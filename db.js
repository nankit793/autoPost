const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nankit793:Qwerty123@cluster0.h3rr0iw.mongodb.net/');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});
