import React from 'react';
import { Button } from 'antd';
import uuid from 'uuid';
import { URLS, KEYS } from '../../constants';
import { Api } from '../../services';
import { Page } from '../../components';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            loading: false,
        }
    }

    componentDidMount() {
        if (this.hasALoginCall()) {
            this.signinUser();
        } else {
            this.makeQuery();
        }
    }

    hasALoginCall = () => {
        return this.props.location.search;
    }

    makeQuery = () => {
        const query = new URLSearchParams();
        const state = uuid.v4();
        window.localStorage.setItem(KEYS.STATE_KEY, state);
        query.append('client_id', KEYS.CLIENT_ID);
        query.append('redirect_uri', URLS.GITHUB_REDIRECT_URL);
        query.append('scope', KEYS.SCOPE);
        query.append('state', state);

        this.setState({ url: `${URLS.GITHUB_AUTHORIZE}${query}` });
    }

    signinUser = () => {
        this.setState({ loading: true });

        const query = new URLSearchParams(this.props.location.search);
        const state = query.get(KEYS.STATE_KEY);
        const code = query.get(KEYS.CODE_KEY);
        const localState = window.localStorage.getItem(KEYS.STATE_KEY);

        if (state && state === localState) {
            Api.BackendServer.post('login/social/token_user/github/', {
                code,
                client_id: KEYS.CLIENT_ID,
                redirect_uri: URLS.GITHUB_REDIRECT_URL,
            }).then(response => {
                const token = `Token ${response.data.token}`
                Api.BackendServer.defaults.headers.Authorization = token;
                window.localStorage.setItem(KEYS.TOKEN_KEY, token);
                // and redirects
                this.setState({ loading: false });
                this.props.history.push('/');
            })
        } else { // ocorreu algum erro
            console.log("A ERRO FROM DIRETENS STATES");
            this.setState({ loading: false });
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <Page style={{ flex: 1, display: 'flex', height: '100vh', width: '100vw', padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }} loading={this.state.loading}>
                <Button onClick={() => this.setState({ loading: true })} href={this.state.url} type="primary" icon="github" size={'large'}>Entrar com o Github</Button>
            </Page>
        );
    }

}

export default Login;