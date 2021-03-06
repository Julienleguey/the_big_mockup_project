import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

// import components
import ProjectCard from './ProjectCard';
import RenameProjectModal from './RenameProjectModal';
import DeleteProjectModal from './DeleteProjectModal';
import DuplicateProjectModal from './DuplicateProjectModal';

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

  h3 {
    text-align: center;
  }
`;


// Header displayed through all the app
// contains a button to redirect to the default page and a signin/signout button
class ProjectList extends React.Component {

  constructor() {
    super();
    this.state = {
      projects: [],
      modal: "",
      projectModal: "",
      nameModal: ""
    }
  }

  componentWillMount = () => {
    this.loadProjects();
    console.log(process.env.REACT_APP_API_ENDPOINT);
  }

  loadProjects = () => {
    const userId = this.props.loggedUserId;
    const token = localStorage.getItem('token');

    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/projects/list/${userId}`, {
        headers: { Authorization: `obladi ${token}`}
      }).then( response => {
        this.setState({
          projects: response.data
        })
      }).catch(error => {
        console.error(error);
      });
  }

  displayProjects = () => {
    const projs = this.state.projects;
    const truc = projs.map( (proj, index) => {
      return (
        <ProjectCard key={index} name={proj.name} userId={this.props.loggedUserId} projectId={proj.id} openModal={this.openModal}/>
      )
    });
    return truc;
  }

  openModal = (modalName, projectId, projectName) => {
    this.setState({
      modal: modalName,
      projectIdModal: projectId,
      projectNameModal: projectName
    })
  }

  closeModal = () => {
    this.setState({
      modal: ""
    })
  }

  render() {

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

        <RenameProjectModal
          isOpen={this.state.modal === "renameProject" ? true : false}
          setFlash={this.props.context.actions.setFlash}
          reloadProjects={this.loadProjects}
          closeModal={this.closeModal}
          projectId={this.state.projectIdModal}
          projectName={this.state.projectNameModal}
        />

        <DuplicateProjectModal
          isOpen={this.state.modal === "duplicateProject" ? true : false}
          setFlash={this.props.context.actions.setFlash}
          reloadProjects={this.loadProjects}
          closeModal={this.closeModal}
          projectId={this.state.projectIdModal}
          userId={this.props.loggedUserId}
        />

        <DeleteProjectModal
          isOpen={this.state.modal === "deleteProject" ? true : false}
          setFlash={this.props.context.actions.setFlash}
          reloadProjects={this.loadProjects}
          closeModal={this.closeModal}
          projectId={this.state.projectIdModal}
          userId={this.props.loggedUserId}
        />
      </Wrapper>
    );
  }
};


export default ProjectList;
