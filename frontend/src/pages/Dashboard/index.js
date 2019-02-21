import React from 'react';

import {
    Layout, Menu, Icon,
} from 'antd';
import './styles.css';
import { Route } from '../../components';
import {
    Home,
    Projetos,
    Tarefas,
    Colaboradores,
} from './subpages';

const {
    Header, Footer, Sider,
} = Layout;


const PAGES = [
    { 'key': 1, iconName: 'pie-chart', name: 'Home', path: '/' },
    { 'key': 2, iconName: 'project', name: 'Projetos', path: '/projetos' },
    { 'key': 3, iconName: 'ordered-list', name: 'Tarefas', path: '/tarefas' },
    { 'key': 4, iconName: 'robot', name: 'Colaboradores', path: '/colaboradores' },
];


class Dashboard extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div style={{ height: '60px', width: '100%', padding: 10 }}>
                        <div className="logo" style={{ width: '100%', height: '100%', backgroundColor: 'gray' }} />
                    </div>

                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        {PAGES.map(value => (
                            <Menu.Item
                                onClick={() => this.props.history.push(value.path)}
                                key={value.key}
                            >
                                <Icon type={value.iconName} />
                                <span>{value.name}</span>
                            </Menu.Item>
                        ))}

                    </Menu>
                </Sider>

                <Layout style={{ flex: 1 }} >
                    <Header style={{ background: '#fff', padding: 0 }} />

                    <Route.Custom exact path="/projetos" component={Projetos} />
                    <Route.Custom exact path="/tarefas" component={Tarefas} />
                    <Route.Custom exact path="/colaboradores" component={Colaboradores} />
                    <Route.Custom exact path="/" component={Home} />

                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2018 Created by Ant UED
                    </Footer>

                </Layout>
            </Layout>
        );
    }
}

export default Dashboard;
