import React, { Component } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import axios from 'axios';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  margin: 50px;
  text-align: center;
  font-size: 50px;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 1000px;
  border: solid 1px black;
`;

const UserLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid grey;
`;

const Name = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Email = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Status = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonPages = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonPage = styled.div`
  width: 20px;
  height: 20px;
  border: solid 1px black;
  margin: 3px;

  &:hover {
    cursor: pointer;
  }

  &.active {
    background-color: lightgrey;
  }
`;

const nbrOfUsersPerPage = 10;

class AdminLanding extends Component {
  state = {
    users: [],
    page: 1,
    nbrOfPages: 1
  }

  componentWillMount = () => {
    console.log("admin mounted");
    const token = localStorage.getItem('token');
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/admin/all`, {
        headers: { Authorization: `obladi ${token}`}
      }).then( res => {
        console.log("LIST OF THE USERS");
        console.log(res);
        this.setState({
          users: res.data,
          nbrOfPages: Math.ceil(res.data.length / nbrOfUsersPerPage)
        })
      }).catch( err => {
        console.log(err);
      })
  }

  displayUsersLine = () => {
    const users = this.state.users.map( (user, index) => {
      const first = (this.state.page - 1) * nbrOfUsersPerPage;
      const last = (this.state.page * nbrOfUsersPerPage) - 1;
      console.log("premier: ", (this.state.page - 1) * nbrOfUsersPerPage );
      console.log("dernier: ", (this.state.page * nbrOfUsersPerPage) - 1);
      if ( index >= first && index <= last) {
        return (
          <UserLine key={index} onClick={ () => this.props.history.push({ pathname: "/admin_user", state: { user: user }})}>
            <Name>
              <p>{user.firstName} {user.lastName}</p>
            </Name>
            <Email>
              <p>{user.email}</p>
            </Email>
            <Status>
              <p>{user.status}</p>
            </Status>
          </UserLine>
        );
      }
    });
    return users;
  }

  displayButtonPages = () => {
    const nbrOfPagesArray = [...Array(this.state.nbrOfPages).keys()];
    const buttons = nbrOfPagesArray.map( (page, index) => {
      return (
        <ButtonPage
          key={index}
          className={this.state.page === index + 1 ? "active" : null}
          onClick={() => this.setState({page: index + 1})}
        >
          <p>{index + 1}</p>
        </ButtonPage>
      )
    });
    return buttons;
  }

  render() {
    return(
      <Wrapper>
        <Title>Admin Landing</Title>
        <Main>
          <h1>User's list</h1>
          <Table>
            {this.displayUsersLine()}
          </Table>
          <ButtonPages>
            {this.displayButtonPages()}
          </ButtonPages>
        </Main>
      </Wrapper>
    )
  }
}

// search by : firstName, lastName, emailAddress, invoice number
// filter by status


export default withRouter(AdminLanding);
