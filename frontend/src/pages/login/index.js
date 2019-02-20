import React from 'react';
import uuid from 'uuid';
import { URLS } from '../../constants';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: {},
        }
    }

    componentDidMount() {
        const query = new URLSearchParams();
        const state = uuid.v4();
        window.localStorage.setItem('state', state);

        query.append('client_id', 'c3f39f63ffb0d5ca5b9d');
        query.append('redirect_uri', URLS.GITHUB_REDIRECT_URL);
        query.append('state', state);
        query.append('scope', 'read:user,user:email,repo');

        this.setState({ query });
    }

    render() {
        return (
            <div>
                <a href={`https://github.com/login/oauth/authorize?${this.state.query}`}>INICIO</a>
            </div>
        );
    }

}

export default Login;