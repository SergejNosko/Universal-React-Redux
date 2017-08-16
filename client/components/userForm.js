import React from 'react';
import {connect } from 'react-redux';
import {ajax} from '../api';
import {login} from '../actions/index';

class UserForm extends React.Component{
    constructor(){
        super();
    }

    render(){
        return(
            <form action="">
                <input type="text" id="username" name="username"/>
                <input type="password" id="password" name="password"/>
                <button onClick={this.props.sign}>Log In</button>
            </form>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        sign: (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value,
                password = document.getElementById('password').value;
            let url = `http://${window.location.host}/login`;

            ajax(url, 'POST', {username, password}).then((response) => {
                let message = JSON.parse(response);

                if (!message.error)
                    dispatch(login(message.username));
                else {
                    console.log(message.error);
                }
            }).catch((err) => {
                throw err;
            });
        }
    }
};

const UserFormContainer = connect(null, mapDispatchToProps)(UserForm);

export default UserFormContainer;