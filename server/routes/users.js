var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const dotenv = require('dotenv');
dotenv.config();


/* GET users listing. */
router.post('/', async function (req, res, next) {
  console.log('request to /users');
  mongoose.connect(process.env.MDB_CONNECT,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) console.log(err);
      console.log('connected to db');
    }

  )
  const newUser = new User({
    userName: 'akshay',
    passwordHash: '1234',
  });
  const saved = await newUser.save()

  res.send('addedd to db');
});

module.exports = router;
