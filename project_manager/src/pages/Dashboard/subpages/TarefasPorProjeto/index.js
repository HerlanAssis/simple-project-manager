import React from 'react';
import { Table, Button } from 'antd';
import { Page, CreateOrUpdateTask, HabilitarDesabilitarNotificacoes } from '../../../../components';
import moment from 'moment';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../../../modules/Tasks';
import { NotificationsActions } from '../../../../modules/Notifications';
// * END Redux imports *


import './styles.css';


class TarefasPorProjeto extends React.Component {

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

        this.loadTasks = this.loadTasks.bind(this);
    }

    componentDidMount() {
        const { repo } = this.props.location.state;

        this.props.getWacher({
            projectId: repo.id,
        });

        this.props.getAllTasksBy({
            projectId: repo.id,
        })
    }

    loadTasks() {
        const { repo } = this.props.location.state;

        this.props.getAllTasksBy({
            projectId: repo.id,
        })
    }


    render() {
        let { watcher } = this.props;
        const { repo } = this.props.location.state;

        return (
            <Page loading={this.props.requestTasksLoading}>

                <CreateOrUpdateTask ref={'createOrUpdateTask'} contributor={true} reloadData={this.loadTasks} />
                <HabilitarDesabilitarNotificacoes watcher={this.props.watcher} />

                <div style={{ display: 'flex', height: '75px', alignItems: 'center', justifyContent: 'center' }}>
                    <h2>{repo.name}</h2>
                </div>

                <Table
                    rowKey="id"
                    pagination={{
                        hideOnSinglePage: true,
                    }}
                    dataSource={this.props.tasks}
                    columns={this.columns}
                />
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        requestWatcherDone,
        requestWatcherLoading,
        watcher,

    } = state.notifications;

    const {
        requestTasksDone,
        requestTasksLoading,
        tasks,
    } = state.tasks;

    return {
        requestWatcherDone,
        requestWatcherLoading,
        watcher,

        requestTasksDone,
        requestTasksLoading,
        tasks,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getWacher': NotificationsActions.getWacher,
        'getAllTasksBy': TasksActions.getAllTasksBy,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TarefasPorProjeto);
