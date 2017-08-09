import React from 'react';
import { connect } from 'react-redux';
import { verifyAuth } from '../Auth/authActions';

export default function(ComposedComponent) {
  let _isLoading = true;

  class Authenticate extends React.Component {

    componentWillMount() {
      this.props.verifyAuth();
    }

    componentWillUpdate(nextProps, nextState) {
      const { isLoading, isAuthenticated } = nextProps;

      if (_isLoading != isLoading)
        _isLoading = isLoading;

      if (!isAuthenticated) {
        this.context.router.push('/login');
      }
    }

    componentWillUnmount() {
      _isLoading = true;
    }

    render() {
      return (
        <div>
          { !_isLoading && <ComposedComponent/> }
        </div>
      );
    }
  }

  Authenticate.propTypes = {
    isAuthenticated: React.PropTypes.bool.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    verifyAuth: React.PropTypes.func.isRequired
  }

  Authenticate.contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      isLoading: state.auth.isLoading
    }
  }

  return connect(mapStateToProps, { verifyAuth })(Authenticate);
}