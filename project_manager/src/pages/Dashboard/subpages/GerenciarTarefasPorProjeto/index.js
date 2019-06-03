import React from 'react';
import { Table, Card, Statistic, Button, Modal, Divider, Tooltip } from 'antd';
import { Page, HabilitarDesabilitarNotificacoes, CreateOrUpdateTask } from '../../../../components';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../../../modules/Tasks';
import { NotificationsActions } from '../../../../modules/Notifications';
// * END Redux imports *

import moment from 'moment';


import './styles.css';
import { URLS } from '../../../../constants';

class GerenciarTarefasPorProjeto extends React.Component {

    columns = [
        {
            title: 'Data de Criação',
            dataIndex: 'createdAt',
            render: date => moment(date).format('DD/MM/YYYY HH:mm'),
        }, {
            title: 'Última modificação',
            dataIndex: 'updatedAt',
            render: date => moment(date).format('DD/MM/YYYY HH:mm')
        }, {
            title: 'Situação',
            dataIndex: 'status',
        },
        {
            title: 'Título',
            dataIndex: 'title',
        },
        {
            title: 'Responsável',
            dataIndex: 'responsible',
            render: responsible => responsible.username
        },
        {
            title: 'Data prevista de entrega',
            dataIndex: 'expectedDate',
            render: date => moment(date).format('DD/MM/YYYY')
        },
        {
            title: 'Ações',
            render: (text, row) => <div><Button disabled type="link">Detalhar</Button> <Button onClick={() => this.refs.createOrUpdateTask.openModal(row)} type="link">Editar</Button> </div>
        },
    ];

    constructor(props) {
        super(props);
        this.showMonitoringCodes = this.showMonitoringCodes.bind(this);
        this.reloadTaskManager = this.reloadTaskManager.bind(this);
    }

    componentDidMount() {
        const { repo } = this.props.location.state;
        if (repo.is_owner) {
            this.props.getTaskManager({
                projectId: repo.id,
                owner: repo.is_owner,
            });

            this.props.getWacher({
                projectId: repo.id,
            });
        }
    }

    reloadTaskManager() {
        const { repo } = this.props.location.state;
        if (repo.is_owner) {
            this.props.getTaskManager({
                projectId: repo.id,
                owner: repo.is_owner,
            });
        }
    }

    showMonitoringCodes() {
        const { watcher, taskmanager } = this.props;
        Modal.info({
            title: 'Códigos de monitoramento',
            content: (
                <div style={{ marginTop: '20px' }}>
                    <Divider />

                    <div style={{ marginTop: '10px' }}>
                        <h3>Código de convite: </h3>
                        <Card>
                            <h4>
                                {taskmanager.invitationCode}
                            </h4>
                        </Card>
                    </div>

                    <Divider dashed />

                    <div style={{ marginTop: '10px' }}>
                        <h3>
                            Código de monitoramento TelegramBot:
                        </h3>
                        <Card>
                            <h4>
                                <a href={URLS.TELEGRAM_BOT_URL}>@MeninoDeRecado</a> {watcher.authorizationCode}
                            </h4>
                        </Card>
                    </div>
                </div>
            ),
            onOk() { },
        });
    }

    render() {
        const { watcher, taskmanager } = this.props;
        const { repo } = this.props.location.state;
        return (

            <Page loading={this.props.requestTaskManagerLoading || this.props.requestWatcherLoading}>
                {/* <div style={{ display: 'flex', height: '25px', alignItems: 'center', justifyContent: 'flex-end' }}>

                <div style={{ display: 'flex', marginLeft: '5px' }}>
                <Tooltip placement="bottomLeft" title={'Habilitar/Desabilitar notificações por email'}>
                <Button type="primary" icon="mail" size={'default'} />
                </Tooltip>
                </div>

                <div style={{ display: 'flex', marginLeft: '5px' }}>
                <Tooltip placement="bottomLeft" title={'Habilitar/Desabilitar notificações por telegram'}>
                <Button type="primary" icon="robot" size={'default'} />
                </Tooltip>
                </div>
                </div> */}

                <CreateOrUpdateTask ref={'createOrUpdateTask'} reloadTaskManager={this.reloadTaskManager} />
                <HabilitarDesabilitarNotificacoes repo={repo} />


                <div style={{ display: 'flex', height: '75px', alignItems: 'center', justifyContent: 'center' }}>
                    <h2>{repo.name}</h2>
                </div>

                <div style={{ display: 'flex', height: '25px', alignItems: 'center', justifyContent: 'center' }}>
                    <Button onClick={this.showMonitoringCodes} type="primary" icon="eye" size={'large'}>
                        Exibir códigos de monitoramento
                    </Button>
                </div>


                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Card>
                        <Statistic title="Tarefas abertas" value={taskmanager.qtdOpenTasks} />
                    </Card>

                    <Card>
                        <Statistic title="Tarefas concluídas" value={taskmanager.qtdCompletedTasks} />
                    </Card>

                    <Card>
                        <Statistic title="Tarefas concluídas com atraso" value={taskmanager.qtdTasksCompletedLate} />
                    </Card>

                    <Card>
                        <Statistic title="Tarefas atrasadas" value={taskmanager.qtdOverdueTasks} />
                    </Card>

                    <Card>
                        <Statistic title="Tarefas bloqueadas" value={taskmanager.qtdBlockedTasks} />
                    </Card>
                </div>
                <Divider />


                <div style={{ display: 'flex', height: '50px', alignItems: 'center', justifyContent: 'flex-end' }}>

                    <Button onClick={() => this.refs.createOrUpdateTask.openModal()} type="primary" icon="plus" size={'default'} >
                        Adicionar nova tarefa
                    </Button>
                </div>

                <div>
                    <Table rowKey="id"
                        pagination={{
                            hideOnSinglePage: true,
                        }}
                        dataSource={this.props.taskmanager.tasks}
                        columns={this.columns}
                    />
                </div>
            </Page >

        );
    }
}


const mapStateToProps = (state) => {
    const {
        requestTaskManagerLoading,
        requestTasksDone,
        requestTasksLoading,
        taskmanager,
    } = state.tasks;

    const {
        requestWatcherDone,
        requestWatcherLoading,
        watcher,
    } = state.notifications;

    return {
        requestTaskManagerLoading,
        requestTasksDone,
        requestTasksLoading,
        taskmanager,

        requestWatcherDone,
        requestWatcherLoading,
        watcher,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getTaskManager': TasksActions.getTaskManager,
        'getWacher': NotificationsActions.getWacher,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GerenciarTarefasPorProjeto);
