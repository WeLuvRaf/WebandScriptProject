const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://WeLuvRaf:Khanj207@cluster0.aclm2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));
