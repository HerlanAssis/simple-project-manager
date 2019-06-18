import React from 'react';
import { Tooltip, Icon, Modal, Button, Typography, List } from 'antd';
import { Charts, Trend } from 'ant-design-pro';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../../../modules/Tasks';
// * END Redux imports *
import { Page } from '../../../../components';
import './styles.css';

import moment from 'moment';

const { Title } = Typography;

function countDown(code) {
    let secondsToGo = 10;
    const modal = Modal.success({
        title: `Código de convite: ${code}`,
        content: `Esta janela irá fechar em ${secondsToGo} segundos.`,
    });
    const timer = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: `Esta janela irá fechar em ${secondsToGo} segundos.`,
        });
    }, 1000);
    setTimeout(() => {
        clearInterval(timer);
        modal.destroy();
    }, secondsToGo * 1000);
}

class Home extends React.Component {
    componentDidMount() {
        this.props.getAllTaskManagers()
    }

    render() {
        return (
            <Page loading={this.props.requestTaskManagersLoading}>
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={this.props.taskmanagers}
                    renderItem={taskmanager => (
                        <List.Item>
                            <Charts.ChartCard
                                title={<Title level={4}>{taskmanager.projectName}</Title>}
                                action={
                                    <Tooltip title={`Gerenciado ${moment(taskmanager.createdAt).fromNow()}`}>
                                        <Icon type="info-circle-o" />
                                    </Tooltip>
                                }
                                total={`${taskmanager.progress}%`}
                                footer={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <span>
                                                Atrasadas
                                                    <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                                                    {taskmanager.qtdOverdueTasks}
                                                </Trend>
                                            </span>

                                            <span style={{ marginLeft: 16 }}>
                                                Bloqueadas
                                                    <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                                                    {taskmanager.qtdBlockedTasks}
                                                </Trend>
                                            </span>

                                            <span style={{ marginLeft: 16 }}>
                                                Completas
                                                    <Trend flag="up" reverseColor style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                                                    {taskmanager.qtdCompletedTasks}
                                                </Trend>
                                            </span>

                                            <span style={{ marginLeft: 16 }}>
                                                Abertas
                                                    <Trend flag="down" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                                                    {taskmanager.qtdOpenTasks}
                                                </Trend>
                                            </span>

                                        </div>

                                        <div>
                                            <span>
                                                <Button onClick={() => countDown(taskmanager.invitationCode)}>Exibir código</Button>
                                            </span>
                                        </div>
                                    </div>
                                }
                                contentHeight={46}
                            >
                                <Charts.MiniProgress percent={taskmanager.progress} strokeWidth={8} target={100} />
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
        requestTaskManagersDone,
        requestTaskManagersLoading,
        taskmanagers,
    } = state.tasks;

    return {
        requestTaskManagersDone,
        requestTaskManagersLoading,
        taskmanagers,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getAllTaskManagers': TasksActions.getAllTaskManagers,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);