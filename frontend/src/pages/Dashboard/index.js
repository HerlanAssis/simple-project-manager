import React from 'react';

import {
    Layout, Menu, Icon, Progress
} from 'antd';
import './styles.css';
import { Route } from '../../components';
import {
    Home,
    Projetos,
    Tarefas,
    Colaboradores,
    Relatorios,
    Notificacoes,
    Laboratorio,
} from './subpages';
import { Api } from '../../services';
import moment from 'moment';

const {
    Header, Footer, Sider,
} = Layout;


const PAGES = [
    { iconName: 'pie-chart', name: 'Home', path: '/', component: Home },
    { iconName: 'project', name: 'Projetos', path: '/projetos', component: Projetos },
    { iconName: 'ordered-list', name: 'Tarefas', path: '/tarefas', component: Tarefas },
    { iconName: 'robot', name: 'Colaboradores', path: '/colaboradores', component: Colaboradores },
    { iconName: 'file-pdf', name: 'Relatórios', path: '/relatorios', component: Relatorios },
    { iconName: 'notification', name: 'Notificações', path: '/notificacoes', component: Notificacoes },
    { iconName: 'experiment', name: 'Laboratório', path: '/laboratorio', component: Laboratorio },
];

class Dashboard extends React.Component {
    state = {
        collapsed: true,
        rate_limit: 0,
        reset: 0,
    };

    componentDidMount() {
        this.getLimits()
    }

    getLimits() {
        Api.BackendServer.get('github/limits/').then(response => {
            const rate_limit = response.data;
            this.setState({
                rate_limit: parseInt((rate_limit.core.remaining / rate_limit.core.limit) * 100),
                reset: rate_limit.core.reset,
            });

            setTimeout(() => {
                this.getLimits()
            }, 5000);
        })
    }

    render() {

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

                    <Menu theme="dark" defaultSelectedKeys={[this.props.location.pathname]} mode="inline">
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
                    <Header style={{ background: '#fff', padding: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                            
                            <div style={{ flex: 5 }}>
                                <Progress width={100} percent={this.state.rate_limit} showInfo />
                            </div>
                            
                            <div style={{ flex: 1, textAlign:'center' }}>
                                <p>Refresh {moment.unix(this.state.reset).fromNow()}</p>
                            </div>

                        </div>

                    </Header>

                    {PAGES.map(value => (
                        <Route.Custom key={value.path} exact path={value.path} component={value.component} />
                    ))}

                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2018 Created by Ant UED
                    </Footer>

                </Layout>
            </Layout>
        );
    }
}

export default Dashboard;
