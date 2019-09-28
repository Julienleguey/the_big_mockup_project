import React from 'react';
// import { UserContextBis } from './Context';
import axios from 'axios';
import styled from 'styled-components';

// import components
import ProjectCard from './ProjectCard';

// import images
import plus from '../images/add.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 20px 20px;
`;


const NewProject = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 400px;
  height: 200px;
  border: 1px dashed grey;
  border-radius: 10%;

  img {
    width: 40px;
    height: 40px;
    margin: 0 auto;
  }

  h3{
    text-align: center;
  }
`;


// Header displayed through all the app
// contains a button to redirect to the default page and a signin/signout button
class ProjectList extends React.Component {

  constructor() {
    super();
    this.state = {
      projects: [0, 1]
    }
  }



  componentWillMount = () => {
    console.log("Projects mount!");

    const userId = this.props.loggedUserId;

    console.log(userId);

    axios.get(`http://localhost:5000/projects/list/${userId}`).then( response => {
        console.log(response);
        this.setState({
          projects: response.data
        })
      }).then( () => {
        // this.displayProjects();
        console.log("meh");
      }).catch(error => {

        console.error(error);
        // if (error.response.status === 500) {
        //   this.props.history.push("/error");
        // } else {
        //   // used by UserSignIn to display the error messages (incorrect email or password)
        //   this.setState({
        //     errorMessageSignIn: error.response.data.message,
        //     isErrorSignIn: true
        //   });
        // }
      });
  }

  displayProjects = () => {
    const projs = this.state.projects;
    const truc = projs.map( (proj, index) => {
      console.log(proj);
      return (
        <ProjectCard key={index} name={proj.name} userId={this.props.loggedUserId} projectId={proj.id} />
      )
    });
    return truc;
  }

  // displayProjects = () => {
  //
  //   const list = document.querySelector('#list');
  //
  //   const projs = this.state.projects;
  //   const truc = projs.map( proj => {
  //     return (
  //       <ProjectsList name={proj.name}/>
  //     )
  //   });
  //   // return truc;
  //   list.appendChild(truc);
  // }

  render() {
    console.log(this.state.projects);

    return (
      <Wrapper>
        <h1>My Projects</h1>
        <List id="list">
          <NewProject link href="/onboarding-project">
            <img src={plus} alt="plus symbol"/>
            <h3>Create a new project</h3>
          </NewProject>
          {this.displayProjects()}
        </List>
      </Wrapper>
    );
  }
};


export default ProjectList;
