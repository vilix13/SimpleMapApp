import React from 'react';
import { connect } from 'react-redux';

import validateSignup from '../../server/shared/validations/signup';
import validateSignin from '../../server/shared/validations/signin';

import { userCreateRequest } from '../Users/usersActions';
import { login, loginByToken } from '../Auth/authActions';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
      repassword: '',
      isNewUser: false,
      errors: {},
      isLoading: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleIsNewUserChange = this.toggleIsNewUserChange.bind(this);
  }

  componentWillMount() {
    if (this.props.isAuthenticated)
      this.context.router.push('/');
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.isAuthenticated)
      this.context.router.push('/');
  }

  toggleIsNewUserChange() {
    this.setState({ isNewUser: !this.state.isNewUser });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const { userCreateRequest, loginByToken, login } = this.props;

    this.setState({ isLoading: true })

    if (this.state.isNewUser)
    {
      if (!this.isValidSignup())
      {
        this.setState({ isLoading: false });
        return;
      }

      userCreateRequest(this.state).then(
        (res) => {
          const token = res.data.token;

          loginByToken(token).then(() => {
            this.context.router.push('/')
          }).catch(() => {
            this.setState({ isLoading: false });
          });

        },
        (err) => {
          this.setState({ errors: err.response.data, isLoading: false });
        }
      );
    }
    else
    {
      if (!this.isValidSignin())
      {
        this.setState({ isLoading: false });
        return;
      }
      const { username, password } = this.state;
      login(username, password).then(() => {
          this.context.router.push('/')
        }).catch(err => {
          this.setState({
            isLoading: false, 
            errors: {
              username: 'Username and password does not match',
              password: ' '
            } 
          });
        });
    }
  }

  isValidSignup() {
    const {errors, isValid } = validateSignup(this.state);

    this.setState({ errors });

    return isValid;
  }

  isValidSignin() {
    const {errors, isValid } = validateSignin(this.state);

    this.setState({ errors });

    return isValid;
  }

  render() {
    const { isNewUser, errors, isLoading, username, password, repassword } = this.state;
    const isAuthLoading = this.props.isAuthLoading;
    
    const form = (
      <form onSubmit={this.onSubmit} className="col-md-4 col-md-offset-4">
        <div className={`form-group ${errors.username && 'has-error'}`}>
          <label className="control-label">Username</label>
          <input 
            type="text" 
            className="form-control" 
            name="username"
            value={username}
            onChange={this.onChange}
            placeholder="Username"/>
            {errors.username && <span className="help-block">{errors.username}</span>}
        </div>
        <div className={`form-group ${errors.password && 'has-error'}`}>
          <label className="control-label">Password</label>
          <input 
            type="password" 
            className="form-control"
            value={password}
            name="password" 
            onChange={this.onChange}
            placeholder="Password"/>
            {errors.password && <span className="help-block">{errors.password}</span>}
        </div>
        <div className="checkbox">
          <label>
            <input
              name="isNewUser"
              checked={this.state.isNewUser}
              onChange={this.toggleIsNewUserChange}
              type="checkbox"/> New user?
          </label>
        </div>
        {isNewUser &&
          <div className={`form-group ${errors.repassword && 'has-error'}`}>
            <label className="control-label">Confirm password</label>
            <input 
              type="password" 
              className="form-control" 
              name="repassword"
              value={repassword}
              onChange={this.onChange}
              placeholder="Confirm password"/>
              {errors.repassword && <span className="help-block">{errors.repassword}</span>}
          </div>
        }
        <button type="submit" className={`btn btn-primary ${isLoading && 'disabled'}`}>{isNewUser ? 'Sign up' : 'Login'}</button>
      </form>
    );

    return !isAuthLoading && form;
  }
}

Auth.contextTypes = {
  router: React.PropTypes.object.isRequired
}

Auth.propTypes = {
  userCreateRequest: React.PropTypes.func.isRequired,
  login: React.PropTypes.func.isRequired,
  loginByToken: React.PropTypes.func.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired
}

export default connect((state) => { 
    return { 
      isAuthenticated: state.auth.isAuthenticated,
      isAuthLoading: state.auth.isLoading
    } ;
  }, { userCreateRequest, login, loginByToken })(Auth);