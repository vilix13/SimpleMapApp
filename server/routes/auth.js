import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../config';
import authenticate from '../middlewares/authenticate';
import User from '../models/user';

const router = express.Router();

router.get('/verify', authenticate, (req, res) => {
  res.status(200).json({});
});

router.post('/', (req, res) => {
  const { username, password } = req.body;

  User.findOne({username}).exec().then(user => {
    if (!user)
      res.status(404).json({ error: 'No such user' });
    else {
      bcrypt.compare(password, user.get('password')).then(result => {
        if (result === true) {
          const token = jwt.sign({id: user.get('id')}, config.jwtSecret);
          res.status(200).json({ user: user.toObject(), token });
        } else {
          res.status(401).json({ error: 'Failed to authenticate' });
        }
      }).catch(err => {
        res.status(500).json({error : err});
      });
    }
  }).catch(err => {
    res.status(500).json({error : err});
  });
  ;
});

export default router;
