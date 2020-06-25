import React from 'react';
import { Button, List, Typography, Icon } from 'antd';
import uuid from 'uuid';
import { URLS, KEYS } from '../../constants';
import { Page } from '../../components';
import { images } from '../../styles';

// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AuthActions } from '../../modules/Authentication';
// * END Redux imports *

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

    componentWillReceiveProps(nextProps) {
        if (nextProps.requestTokenDone) {
            // and redirects
            this.setState({ loading: false });
            nextProps.history.push('/');
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
            this.props.login({
                code,
                client_id: KEYS.CLIENT_ID,
                redirect_uri: URLS.GITHUB_REDIRECT_URL,
                token_key: KEYS.TOKEN_KEY,
            });
        } else { // ocorreu algum erro
            console.log("A ERRO FROM DIRETENS STATES");
            this.setState({ loading: false });
            this.props.history.push('/login');
        }
    }

    render() {
        const features = [
            {
                'name': 'Gerência de projetos',
                'icon': 'project',
            },
            {
                'name': 'Relatórios de progresso',
                'icon': 'file-pdf',
            },
            {
                'name': 'Monitoramento de projetos abertos',
                'icon': 'star',
            },
            {
                'name': 'Notificações',
                'icon': 'notification',
            },
        ]

        return (
            <Page style={{
                flex: 1, display: 'flex', height: '100vh', width: '100vw', padding: 0, margin: 0, backgroundImage: `url(${images.background})`, backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }} loading={this.state.loading}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', flex: 1, flexDirection: "column", }}>
                    <div style={{ flex: 1, margin: '8px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <img style={{ width: '12%', height: 'auto', }} src={images.logo["icon-green"]} alt="Logo icon" />
                            <Typography.Title style={{ textAlign: "center", color: '#25b864' }}>
                                Simple Project Manager
                            </Typography.Title>

                            <Typography.Title level={4} style={{ color: "#25b864" }}>
                                Uma maneira simples de gerenciar seus projetos de  software.
                        </Typography.Title >
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Button onClick={() => this.setState({ loading: true })} href={this.state.url} type="primary" icon="github" size={'large'}>Entrar com o Github</Button>
                        </div>
                    </div>

                    <div style={{ flex: 1, margin: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <List
                            grid={{ gutter: 16, column: 4 }}
                            dataSource={features}
                            header={<Typography.Title level={2} style={{ textAlign: "center", color: '#25b864' }}>
                                Recursos
                            </Typography.Title>}
                            renderItem={item => (
                                <List.Item style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: "column" }}>
                                    <div
                                        style={{
                                            display: 'flex', height: '120px', width: '120px', borderRadius: '60px', backgroundColor: '#25b864', margin: '8px', justifyContent: "center", alignItems: 'center'
                                        }}>
                                        <Icon type={item.icon} style={{
                                            fontSize: '60px'
                                        }} />
                                    </div>

                                    <Typography.Title level={3} style={{ textAlign: "center", color: '#25b864' }}>
                                        {item.name}
                                    </Typography.Title>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </Page>
        );
    }

}

const mapStateToProps = (state) => {
    const {
        requestTokenDone,
        requestTokenLoading,
    } = state.authentication;

    return {
        requestTokenDone,
        requestTokenLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'login': AuthActions.authLogin,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
