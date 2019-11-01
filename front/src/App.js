import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import './css/global.css';

// App components
import PrivateRoute from './components/PrivateRoute';
import PrivateAdmin from './components/PrivateAdmin';
import Header from './components/Header';
import FlashAll from './components/FlashAll';
import Profile from './components/Profile';
import Landing from './components/Landing';
import SignContainer from './components/SignContainer';
import SignOut from './components/SignOut';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProjectList from './components/ProjectList';
import OnboardingProject from './components/OnboardingProject';
import Project from './components/Project';
import PaymentStart from './components/PaymentStart';
import Pricing from './components/Pricing';
import AdminLanding from './components/AdminLanding';
import AdminUser from './components/AdminUser';

import withContext from './components/Context/Context';

const HeaderWithContext = withContext(Header);
const FlashAllWithContext = withContext(FlashAll);
const ProfileWithContext = withContext(Profile);
const ProjectListWithContext = withContext(ProjectList);
const LandingWithContext = withContext(Landing);
const SignContainerWithContext = withContext(SignContainer);
const SignOutWithContext = withContext(SignOut);
const ForgotPasswordWithContext = withContext(ForgotPassword);
const ResetPasswordWithContext = withContext(ResetPassword);
const OnboardingProjectWithContext = withContext(OnboardingProject);
const ProjectWithContext = withContext(Project);
const PricingWithContext = withContext(Pricing);
const PaymentStartWithContext = withContext(PaymentStart);
const AdminUserWithContext = withContext(AdminUser);

class App extends Component {
  render() {
    console.log("YEAAAAAH WE'RE INSIDE APP");
    return (
      <BrowserRouter>
          <div>
            <Route path="/" render={ () => <HeaderWithContext /> } />
            <Route path="/" render={ () => <FlashAllWithContext /> } />
            <Switch>
              <PrivateRoute exact path="/projects" component={ProjectListWithContext} />
              <Route exact path="/profile" render={ () => <ProfileWithContext /> } />
              <Route exact path="/" render={ () => <LandingWithContext /> } />
              <Route exact path="/login" render={ () => <SignContainerWithContext /> } />
              <Route exact path="/signout" render={ () => <SignOutWithContext /> } />
              <Route exact path="/forgot_password" render={ () => <ForgotPasswordWithContext /> } />
              <Route exact path="/reset_password/:resetPasswordToken" render={ () => <ResetPasswordWithContext /> } />
              <Route exact path="/onboarding-project" render={ () => <OnboardingProjectWithContext /> } />
              <Route exact path="/project" render={ () => <ProjectWithContext /> } />
              <Route exact path="/pricing" render={ () => <PricingWithContext /> } />
              <Route exact path="/paymentstart" render={ () => <PaymentStartWithContext /> } />
              <PrivateAdmin exact path="/admin" component={AdminLanding} />
              <PrivateAdmin exact path="/admin_user" component={AdminUserWithContext} />
            </Switch>
          </div>
      </BrowserRouter>
    );
  }
}

export default App;
