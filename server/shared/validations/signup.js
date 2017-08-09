import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validate(data) {
  let errors = {};

  if (Validator.isEmpty(data.username)) {
    errors.username = 'This field is required';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }
  if (Validator.isEmpty(data.repassword)) {
    errors.repassword = 'This field is required';
  }
  if (!Validator.equals(data.password, data.repassword)) {
    errors.repassword = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
