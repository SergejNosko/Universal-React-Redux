import React from 'react';
import {connect} from 'react-redux';
import UserForm from './userForm';
import Calendar from './Calendar';

class Main extends React.Component{
    render(){
        return(
            <div>
                <h1>Main</h1>
                {!this.props.username && <UserForm/>}
                {this.props.username && <Calendar/>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return{
      username: state.username
  }
};

const MainContainer = connect(mapStateToProps)(Main);

export default MainContainer;