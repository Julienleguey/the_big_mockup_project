import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import './css/global.css';


// App components
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Landing from './components/Landing';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import ProjectList from './components/ProjectList';
import OnboardingProject from './components/OnboardingProject';
import Project from './components/Project';



class App extends Component {
  render() {
    return (
          <div>

            <Route path="/" render={ () => <Header /> } />

            <Switch>

              <PrivateRoute exact path="/projects" component={ProjectList} />

              <Route exact path="/" render={ () => <Landing /> } />
              <Route exact path="/signup" render={ () => <SignUp /> } />
              <Route exact path="/signin" render={ () => <SignIn /> } />
              <Route exact path="/signout" render={ () => <SignOut /> } />
              <Route exact path="/onboarding-project" render={ () => <OnboardingProject /> } />
              <Route exact path="/project/:id" render={ () => <Project /> } />
            </Switch>

          </div>
    );
  }
}

export default App;
