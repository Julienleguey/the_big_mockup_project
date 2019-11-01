import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import './css/global.css';

// App components
import App from './App';
import RestrainedAccess from './components/RestrainedAccess';
import PrivateAccess from './components/PrivateAccess';

class AppRestrained extends Component {
  render() {
    return (
      <BrowserRouter>
          <div>
            <PrivateAccess path="/" component={App} />
            <Route exact path="/restrained" render={ () => <RestrainedAccess /> } />
          </div>
      </BrowserRouter>
    );
  }
}

export default AppRestrained;
