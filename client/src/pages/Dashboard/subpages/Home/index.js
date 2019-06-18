import React from 'react';
import { Tooltip, Icon, Button, Typography, List, Input } from 'antd';
import { Charts, Trend } from 'ant-design-pro';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// * END Redux imports *
import { Page } from '../../../../components';
import './styles.css';

import moment from 'moment';
import { NotificationsActions } from '../../../../modules/Notifications';
import { NotificationWindow } from '../../../../services';

const { Title } = Typography;
const { Search } = Input;

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searching: false,
        }
    }

    componentDidMount() {
        this.props.getAllWatchers()
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.searching && nextProps.requestCreateWatcherDone) {
            this.props.getAllWatchers()
            this.setState({ searching: false });
        }
    }

    render() {
        const { history } = this.props;

        return (
            <Page loading={this.props.requestAllWatchersLoading || this.props.requestCreateWatcherLoading}>
                <List
                    header={<div style={{ display: 'flex', flex: 1, margin: '8px' }}>
                        <Search
                            size="large"
                            placeholder="Digite o código de convite"
                            enterButton="Adicionar"
                            prefix={
                                <Tooltip title="O código é fornecido pelo gerente do projeto">
                                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                            onSearch={value => {
                                // this.setState({ loading: true, done: false });
                                // Api.BackendServer.get('pm/search/', { params: { reponame: value } }).then(response => {
                                //     this.setState({ loading: false, done: true, last_search: value, search_repos: response.data })
                                // })

                                this.props.createWacherAsGuest({
                                    invitationCode: value,
                                });

                                this.setState({ searching: true });
                            }}
                            style={{ width: '100%' }}
                        />
                    </div>}
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={this.props.watchers}
                    renderItem={watcher => (
                        <List.Item>
                            <Charts.ChartCard
                                title={<Title level={4}>{watcher.vigilant.projectName}</Title>}
                                action={
                                    <Tooltip title={`Gerenciado ${moment(watcher.vigilant.createdAt).fromNow()}`}>
                                        <Icon type="info-circle-o" />
                                    </Tooltip>
                                }
                                total={`${watcher.vigilant.progress}%`}
                                footer={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <span>
                                                Atrasadas
                                                    <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                                                    {watcher.vigilant.qtdOverdueTasks}
                                                </Trend>
                                            </span>

                                            <span style={{ marginLeft: 16 }}>
                                                Bloqueadas
                                                    <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                                                    {watcher.vigilant.qtdBlockedTasks}
                                                </Trend>
                                            </span>

                                            <span style={{ marginLeft: 16 }}>
                                                Completas
                                                    <Trend flag="up" reverseColor style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                                                    {watcher.vigilant.qtdCompletedTasks}
                                                </Trend>
                                            </span>

                                            <span style={{ marginLeft: 16 }}>
                                                Abertas
                                                    <Trend flag="down" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                                                    {watcher.vigilant.qtdOpenTasks}
                                                </Trend>
                                            </span>

                                        </div>

                                        <div>
                                            <span>
                                                <Button onClick={() => {
                                                    history.push({
                                                        pathname: `${watcher.vigilant.projectName}/tarefas/`,
                                                        state: { watcher }
                                                    })
                                                }} type="link" size="large" icon="line-chart">
                                                    Detalhar Projeto
                                                </Button>
                                            </span>
                                        </div>
                                    </div>
                                }
                                contentHeight={46}
                            >
                                <Charts.MiniProgress percent={watcher.vigilant.progress} strokeWidth={8} target={100} />
                            </Charts.ChartCard>
                        </List.Item>
                    )}
                />
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        requestAllWatchersDone,
        requestAllWatchersLoading,
        watchers,

        requestCreateWatcherDone,
        requestCreateWatcherLoading,
    } = state.notifications;

    return {
        requestAllWatchersDone,
        requestAllWatchersLoading,
        watchers,

        requestCreateWatcherDone,
        requestCreateWatcherLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getAllWatchers': NotificationsActions.getAllWatchers,
        'createWacherAsGuest': NotificationsActions.createWacherAsGuest,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);