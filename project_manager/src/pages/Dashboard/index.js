import React from 'react';

import {
    Layout, Menu, Icon
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
    // Laboratorio,
    Commits,
    Page404,
    TarefasPorProjeto,
} from './subpages';

// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { AuthActions } from '../../modules/Authentication';
// * END Redux imports *

const {
    Footer, Sider,
} = Layout;

const repository_sub_componentes = (fatherPath) => ([
    // { key: 'Detalhes', path: '/projetos/detalhes/:name', component: Detalhes },
    { key: 'Projeto', path: `${fatherPath}/:projectname/commits/`, component: Commits },
    { key: 'Colaboradores', path: `${fatherPath}/:projectname/colaboradores/`, component: Colaboradores },
    { key: 'TarejasProProjeto', path: `${fatherPath}/:projectname/tarefas/`, component: TarefasPorProjeto },
]);

const PAGES = [
    { iconName: 'pie-chart', name: 'Home', path: '/', component: Home },
    {
        iconName: 'search', name: 'Pesquisar', path: '/pesquisar', component: Pesquisar,
        subcomponents: (fatherPath) => repository_sub_componentes(fatherPath),
    },
    {
        iconName: 'star', name: 'Projetos Assistidos', path: '/monitorando', component: ProjetosAssistidos,
        subcomponents: (fatherPath) => repository_sub_componentes(fatherPath),
    },
    {
        iconName: 'project', name: 'Projetos', path: '/projetos', component: Projetos,
        subcomponents: (fatherPath) => repository_sub_componentes(fatherPath),
    },
    { iconName: 'ordered-list', name: 'Tarefas', path: '/tarefas', component: Tarefas },
    { iconName: 'calendar', name: 'Agenda', path: '/agenda', component: Agenda },
    // { iconName: 'robot', name: 'Colaboradores', path: '/colaboradores', component: Colaboradores },
    { iconName: 'file-pdf', name: 'Relatórios', path: '/relatorios', component: Relatorios },
    { iconName: 'notification', name: 'Notificações', path: '/notificacoes', component: Notificacoes },
    // { iconName: 'experiment', name: 'Laboratório', path: '/laboratorio', component: Laboratorio },
];

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            rate_limit: 0,
            reset: new Date().getTime(),
        };
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

    render() {
        const pages = this.getPages(PAGES);
        pages.push(<Route.Custom key={'page404'} component={Page404} />);

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
                    <Header >

                    </Header>

                    <Switch>
                        {pages}
                    </Switch>

                    <Footer style={{ textAlign: 'center' }}>
                        Simple Project Manager ©2019
                    </Footer>

                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    // const {

    // } = state.authentication;

    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
