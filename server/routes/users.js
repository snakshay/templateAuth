var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


/*--------------------------USER REGISTER---------------------------------------------------------------------------*/
router.post('/register', async function (req, res, next) {
  console.log('request to /register initaited....');
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
  try {
    const { userName, passwordHash, confirmPasswordHash } = req.body;


    if (!userName || !passwordHash || !confirmPasswordHash)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    if (passwordHash.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 6 characters.",
      });

    if (passwordHash !== confirmPasswordHash)
      return res.status(400).json({
        errorMessage: "Please enter the same password twice.",
      });

    const existingUser = await User.findOne({ userName });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });

    const newUser = new User({
      userName, passwordHash, confirmPasswordHash
    });

    const saved = await newUser.save();
    console.log("user added to db" + saved);
    const token = jwt.sign(
      {
        user: saved._id,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,

      })
      .send(newUser);

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }



});


/*--------------------------USER lOGIN---------------------------------------------------------------------------*/

router.post('/login', async function (req, res, next) {
  console.log('request to /login initaited....');
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
  try {
    const { userName, passwordHash } = req.body;

    if (!userName || !passwordHash)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    if (passwordHash.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 6 characters.",
      });

    const existingUser = await User.findOne({ userName });
    if (!existingUser || existingUser.passwordHash !== passwordHash)
      return res.status(401).json({
        errorMessage: 'Username or password incorrect'
      });

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    }).send(existingUser);
  }
  catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
