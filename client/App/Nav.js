import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../Auth/authActions';

class Nav extends React.Component {

  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  render() {

    const { isAuthenticated } = this.props.auth;

    let username = '';
    if (this.props.auth.user)
      username = this.props.auth.user.username;

    const userBlock = (
      <div className="nav navbar-nav navbar-right">
        <p className="navbar-text">{username}</p>
        <ul className="nav navbar-nav">
          <li><Link to='/about'>About</Link></li>
          <li><a href="#" onClick={this.logout.bind(this)}>Logout</a></li>
        </ul>
      </div>
    );

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to='/' className="navbar-brand">MapApp</Link>
          </div>
            { isAuthenticated && userBlock }
        </div>
      </nav>
    );
  }
}

Nav.propTypes = {
  auth: React.PropTypes.object.isRequired,
  logout: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, { logout })(Nav);