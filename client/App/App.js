import React from 'react';

import Nav from './Nav';

class App extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;