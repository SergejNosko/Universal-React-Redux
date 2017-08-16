import React from 'react';
import UserForm from './userForm'

class Main extends React.Component{
    render(){
        return(
            <div>
                <h1>Main</h1>
                {!this.props.username && <UserForm/>}
            </div>
        )
    }
}

export default Main;