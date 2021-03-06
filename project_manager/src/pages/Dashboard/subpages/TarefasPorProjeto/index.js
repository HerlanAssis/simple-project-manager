import React from 'react';
import { Table, Card, Statistic, Button, Modal, Divider, Progress, Typography } from 'antd';
import { Page, HabilitarDesabilitarNotificacoes, CreateOrUpdateTask, DetailTask } from '../../../../components';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../../../modules/Tasks';
import { NotificationsActions } from '../../../../modules/Notifications';
// * END Redux imports *

import moment from 'moment';
import './styles.css';
import { URLS } from '../../../../constants';

const { Title } = Typography;

const STATUS = {
    'TODO': 'A fazer',
    'DOING': 'Fazendo',
    'BLOCKED': 'Bloqueada',
    'DONE': 'Feito',
}

class TarefasPorProjeto extends React.Component {

    constructor(props) {
        super(props);
        this.showMonitoringCodes = this.showMonitoringCodes.bind(this);
        this.reloadTaskManager = this.reloadTaskManager.bind(this);
        this.amIManager = this.amIManager.bind(this);
        this.canIEditThisTask = this.canIEditThisTask.bind(this);

        this.state = {
            canRequestWatcher: true,
        }
    }

    componentDidMount() {
        const { repo } = this.props.location.state;
        this.props.getTaskManager({
            projectId: repo.id,
            owner: repo.is_owner,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.canRequestWatcher && nextProps.requestTaskManagerDone) {
            this.setState({ canRequestWatcher: false });

            const { repo } = nextProps.location.state;
            nextProps.getWacher({
                projectId: repo.id,
            });

        }
    }

    amIManager() {
        const { repo } = this.props.location.state;
        return repo.is_owner;
    }

    canIEditThisTask(task) {
        if (this.amIManager()) return true;

        // validar dados
        if (task && task.responsible && task.responsible.id) {
            return Number(this.props.user.id) === Number(task.responsible.id);
        }

        return false;
    }


    reloadTaskManager() {
        const { repo } = this.props.location.state;
        this.props.getTaskManager({
            projectId: repo.id,
            owner: repo.is_owner,
        });
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
                                {this.amIManager() ? taskmanager.invitationCode : 'xxxxxxxxxx'}
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
        const { taskmanager } = this.props;
        const { repo } = this.props.location.state;

        const columns = [
            {
                title: 'Data de Criação',
                dataIndex: 'createdAt',
                render: date => moment(date).format('DD/MM/YYYY HH:mm'),
                sorter: (a, b) => moment(b.createdAt).toDate().getTime() - moment(a.createdAt).toDate().getTime(),
            }, {
                title: 'Última modificação',
                dataIndex: 'updatedAt',
                render: date => moment(date).format('DD/MM/YYYY HH:mm'),
                sorter: (a, b) => moment(b.createdAt).toDate().getTime() - moment(a.createdAt).toDate().getTime(),
            }, {
                title: 'Situação',
                dataIndex: 'status',
                render: (e) => STATUS[e],
                filters: Object.entries(STATUS).map(([key, value]) => ({ 'text': value, 'value': key })),
                // filteredValue: this.state.filteredInfo.name || null,
                onFilter: (value, record) => record.status.includes(value),
            },
            {
                title: 'Título',
                dataIndex: 'title',
            },
            {
                title: 'Responsável',
                dataIndex: 'responsible',
                render: responsible => responsible ? responsible.username : '-'
            },
            {
                title: 'Data prevista de entrega',
                dataIndex: 'expectedDate',
                render: date => moment(date).format('DD/MM/YYYY'),
                sorter: (a, b) => moment(b.createdAt).toDate().getTime() - moment(a.createdAt).toDate().getTime(),
            },
            {
                title: 'Ações',
                render: (text, row) => <div><Button onClick={() => this.refs.detailTask.openModal(row)} type="link">Detalhar</Button> <Button disabled={!this.canIEditThisTask(row)} onClick={() => this.refs.createOrUpdateTask.openModal(row)} type="link">Editar</Button> </div>
            },
        ];

        return (
            <Page loading={this.props.requestTaskManagerLoading || this.props.requestWatcherLoading}>

                <CreateOrUpdateTask contributor={!this.amIManager()} ref={'createOrUpdateTask'} reloadData={this.reloadTaskManager} />
                <DetailTask ref={'detailTask'} />
                <HabilitarDesabilitarNotificacoes watcher={this.props.watcher} />


                <div style={{ display: 'flex', height: '75px', alignItems: 'center', justifyContent: 'center' }}>
                    <Title>{repo.name}</Title>
                </div>

                {taskmanager && <div>
                    <div style={{ display: 'flex', height: '25px', alignItems: 'center', justifyContent: 'center' }}>
                        <Button onClick={this.showMonitoringCodes} type="primary" icon="eye" size={'large'}>
                            Exibir códigos de monitoramento
                    </Button>
                    </div>


                    <Divider />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Card>
                                <Statistic valueStyle={{ textAlign: 'center' }} title="Tarefas abertas" value={taskmanager.qtdOpenTasks} />
                            </Card>

                            <Card>
                                <Statistic valueStyle={{ textAlign: 'center' }} title="Tarefas concluídas com atraso" value={taskmanager.qtdTasksCompletedLate} />
                            </Card>

                            <Card>
                                <Statistic valueStyle={{ textAlign: 'center' }} title="Tarefas concluídas" value={taskmanager.qtdCompletedTasks} />
                            </Card>

                            <Card>
                                <Statistic valueStyle={{ textAlign: 'center' }} title="Tarefas atrasadas" value={taskmanager.qtdOverdueTasks} />
                            </Card>

                            <Card>
                                <Statistic valueStyle={{ textAlign: 'center' }} title="Tarefas bloqueadas" value={taskmanager.qtdBlockedTasks} />
                            </Card>
                        </div>

                        <div style={{ margin: '20px', marginBottom: '0px' }}>
                            <Progress percent={this.props.taskmanager.progress} status="active" />
                        </div>

                    </div>
                    <Divider />
                </div>}

                <div style={{ display: 'flex', height: '50px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button disabled={!this.amIManager()} onClick={() => this.refs.createOrUpdateTask.openModal()} type="primary" icon="plus" size={'default'} >
                        Adicionar nova tarefa
                    </Button>
                </div>

                <div>
                    <Table
                        rowKey="id"
                        pagination={{
                            hideOnSinglePage: true,
                        }}
                        dataSource={taskmanager ? taskmanager.tasks : []}
                        columns={columns}
                    />
                </div>
            </Page >

        );
    }
}

const mapStateToProps = (state) => {
    const {
        requestTaskManagerLoading,
        requestTaskManagerDone,
        taskmanager,
    } = state.tasks;

    const {
        user,
    } = state.authentication;

    const {
        requestWatcherDone,
        requestWatcherLoading,
        watcher,
    } = state.notifications;

    return {
        requestTaskManagerLoading,
        requestTaskManagerDone,
        taskmanager,

        user,

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

export default connect(mapStateToProps, mapDispatchToProps)(TarefasPorProjeto);
