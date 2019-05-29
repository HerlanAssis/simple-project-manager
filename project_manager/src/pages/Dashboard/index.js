import React from 'react';

import {
    Layout, Menu, Icon, Modal
} from 'antd';

import {
    Switch,
} from 'react-router-dom'

import './styles.css';
import { Route, Header } from '../../components';
import {
    Home,
    Pesquisar,
    Projetos,
    ProjetosAssistidos,
    Tarefas,
    Agenda,
    Colaboradores,
    Relatorios,
    Notificacoes,
    Laboratorio,
    Commits,
    Page404,
} from './subpages';

// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AuthActions } from '../../modules/Authentication';
import { UserActions } from '../../modules/User';
// * END Redux imports *
import { KEYS } from '../../constants';

const {
    Footer, Sider,
} = Layout;

const confirm = Modal.confirm;

const PAGES = [
    { iconName: 'pie-chart', name: 'Home', path: '/', component: Home },
    {
        iconName: 'search', name: 'Pesquisar', path: '/pesquisar', component: Pesquisar,
        subcomponents: (fatherPath) => [
            // { key: 'Detalhes', path: '/projetos/detalhes/:name', component: Detalhes },
            { key: 'Projeto', path: `${fatherPath}/:projectname/commits/`, component: Commits },
            { key: 'Colaboradores', path: `${fatherPath}/:projectname/colaboradores/`, component: Colaboradores },
        ],
    },
    {
        iconName: 'star', name: 'Projetos Assistidos', path: '/monitorando', component: ProjetosAssistidos,
        subcomponents: (fatherPath) => [
            // { key: 'Detalhes', path: '/projetos/detalhes/:name', component: Detalhes },
            { key: 'Projeto', path: `${fatherPath}/:projectname/commits/`, component: Commits },
            { key: 'Colaboradores', path: `${fatherPath}/:projectname/colaboradores/`, component: Colaboradores },
        ],
    },
    {
        iconName: 'project', name: 'Projetos', path: '/projetos', component: Projetos,
        subcomponents: (fatherPath) => [
            // { key: 'Detalhes', path: '/projetos/detalhes/:name', component: Detalhes },
            { key: 'Projeto', path: `${fatherPath}/:projectname/commits/`, component: Commits },
            { key: 'Colaboradores', path: `${fatherPath}/:projectname/colaboradores/`, component: Colaboradores },
        ],
    },
    { iconName: 'ordered-list', name: 'Tarefas', path: '/tarefas', component: Tarefas },
    { iconName: 'calendar', name: 'Agenda', path: '/agenda', component: Agenda },
    // { iconName: 'robot', name: 'Colaboradores', path: '/colaboradores', component: Colaboradores },
    { iconName: 'file-pdf', name: 'Relatórios', path: '/relatorios', component: Relatorios },
    { iconName: 'notification', name: 'Notificações', path: '/notificacoes', component: Notificacoes },
    { iconName: 'experiment', name: 'Laboratório', path: '/laboratorio', component: Laboratorio },
];

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            rate_limit: 0,
            reset: new Date().getTime(),
        };
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.props.getLimits();
        this.props.getUser();
    }

    getPages(pages) {
        let builded_pages = []

        pages.forEach(value => {
            builded_pages.push(
                <Route.Custom exact={true} key={value.path} path={value.path} component={value.component} />
            )

            if (value.subcomponents) {
                builded_pages = [...builded_pages, ...this.getPages(value.subcomponents(value.path))];
            }
        });

        return builded_pages;
    }

    logout() {
        confirm({
            title: 'Sair do sistema?',
            content: 'Ao sair do sistema sua sessão será encerrada.',
            okText: 'Sair',
            cancelText: 'Cancelar',
            onOk: () => {
                this.props.logout({ token_key: KEYS.TOKEN_KEY });
            },
            onCancel: () => { },
        });
    }

    render() {
        const pages = this.getPages(PAGES);
        pages.push(<Route.Custom key={'page404'} component={Page404} />);

        const { limits } = this.props;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsed={this.state.collapsed}
                    collapsible={false}
                >
                    <div style={{ height: '60px', width: '100%', padding: 10 }}>
                        <div className="logo" style={{ display: 'flex', height: '100%', width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray' }} >
                        </div>
                    </div>

                    <Menu theme="dark" defaultSelectedKeys={[this.props.location.pathname]} mode="vertical">

                        {PAGES.map(value => (
                            <Menu.Item
                                onClick={() => this.props.history.push(value.path)}
                                key={value.path}
                            >
                                <Icon type={value.iconName} />
                                <span>{value.name}</span>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>

                <Layout style={{ flex: 1 }} >
                    <Header
                        rate_limit={parseInt((limits.core.remaining / limits.core.limit) * 100)}
                        reset={limits.core.reset}
                        logout={this.logout}
                    >

                    </Header>

                    <Switch>
                        {pages}
                    </Switch>

                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2018 Created by Ant UED
                    </Footer>

                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        removeTokenLoading,
        removeTokenDone,
    } = state.authentication;

    const {
        requestUserLoading,
        requestUserDone,
        user,

        requestLimitsLoading,
        requestLimitsDone,
        limits,
    } = state.user;

    return {
        removeTokenLoading,
        removeTokenDone,

        requestUserLoading,
        requestUserDone,
        user,

        requestLimitsLoading,
        requestLimitsDone,
        limits,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'logout': AuthActions.authLogout,
        'getUser': UserActions.getUser,
        'getLimits': UserActions.getLimits,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
