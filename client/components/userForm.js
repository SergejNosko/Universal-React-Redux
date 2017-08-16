import React from 'react';

class UserForm extends React.Component{
    render(){
        return(
            <form action="">
                <input type="text" name="name"/>
                <input type="password" name="password"/>
                <input type="submit"/>
            </form>
        )
    }
}

export default UserForm;