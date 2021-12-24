const mongoose = require('mongoose');
const {DB_USER, DB_PASS, DB_HOST, DB_NAME} = require('./config/keys');
const databaseInitialization = require('./utils/database-initialization');
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: DB_USER,
  pass: DB_PASS,
  dbName: DB_NAME,
};

mongoose.connect(DB_HOST, options);

console.log(DB_HOST);

mongoose.connection.on('connected', () => {
  console.log('Database connected');
  databaseInitialization().catch(e => {
    console.log('Database initialization failed', e);
  });
});

mongoose.connection.on('error', err => {
  console.log('Database connection error', err);
});
