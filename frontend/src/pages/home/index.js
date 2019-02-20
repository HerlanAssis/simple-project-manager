import React from 'react';
import {
    withRouter
} from 'react-router-dom';

import { Api } from '../../services';
import { setInterval } from 'core-js';

class Home extends React.Component {
    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);

        console.log("PROPS", this.props)
        const state = query.get("state");
        const code = query.get("code");
        const localState = window.localStorage.getItem("state");

        if (state && state === localState) {
            Api.BackendServer.post('login/social/token_user/github/', {
                code,
                redirect_uri: 'http://localhost/home#/',
            }).then(response => {
                console.log("RESPONSE", response);
                Api.BackendServer.defaults.headers.Authorization = `Token ${response.data.token}`

                setInterval(() => {
                    Api.BackendServer.get('github/user/repos', {
                    }).then(e => console.log("REPOS", e))
                }, 5000)
            })
        } else {
            console.log("STATE DIFERENTS")
        }

    }

    render() {
        return (
            <div>
                HOME
            </div>
        );
    }
}

export default withRouter(Home);
