import express from 'express';
import bcrypt from 'bcryptjs';
import isEmpty from 'lodash/isEmpty';
import jwt from 'jsonwebtoken';

import validateSignup from '../shared/validations/signup';
import User from '../models/user';
import UserMarkers from '../models/userMarkers';
import authenticate from '../middlewares/authenticate';
import config from '../config';

const router = express.Router();

function validate(data, validateSignup) {
  const { errors } = validateSignup(data);

  return User.findOne({
    username: data.username 
  }).exec().then(user => {
    if (user) {
        errors.username = 'There is user with such username';
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  });

}

router.get('/me', authenticate, (req, res) => {
  res.status(200).json({user: req.currentUser.toObject()});
});

router.get('/markers', authenticate, (req, res) => {

  const userId = req.currentUser.get('id');

  UserMarkers.findById(userId, (err, userMarkers) => {
    if (err) return res.status(500).json({'error': err});
    if (userMarkers == null) return res.status(404).json({});

    res.status(200).json({markersGeoJson: userMarkers.get('markersGeoJson')});
  });
});

router.put('/markers', authenticate, (req, res) => {

  const { markersGeoJson } = req.body;
  const userId = req.currentUser.get('id');

  UserMarkers.findById(userId).then(um => {
    if (um) {
      um.markersGeoJson = markersGeoJson;
      um.save((err, _um) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({userMarkers: _um.toObject()});
      });
    } else {
      UserMarkers.create({userId: userId, markersGeoJson }).then(userMarkers => {
        res.status(200).json({userMarkers: userMarkers.toObject()});
      }).catch(err => {
        res.status(500).json({ error: err });
      });
    }
  });
});

router.post('/', (req, res) => {
  validate(req.body, validateSignup).then(({ errors, isValid }) => {
    if (isValid) {
      const { username, password } = req.body;
      const password_digest = bcrypt.hashSync(password, 10);

      User.create({
        username, password: password_digest
      }).then(user => { 
        let token = jwt.sign({id: user.get('id')}, config.jwtSecret);
        res.status(200).json({ token });
      })
        .catch(err => res.status(500).json({ error: err }));
    } else {
      res.status(400).json(errors);
    }
  });

});

export default router;
