import React from 'react';
import { List, Button } from 'antd'
import { Page, CreateOrUpdateTask } from '../../../../components';
import moment from 'moment';

// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../../../modules/Tasks';
// * END Redux imports *

import './styles.css';


const STATUS = {
    'TODO': 'irá fazer',
    'DOING': 'fazendo',
    'DONE': 'fez',
    'BLOCKED': 'bloqueou',
}

class Tarefas extends React.Component {

    componentDidMount(){
        this.props.getAllTasks();
    }

    getStatus(key) {
        return STATUS[key];
    }

    render() {
        return (
            <Page loading={this.props.requestTasksLoading}>

                <CreateOrUpdateTask
                    ref='createOrUpdateTask'
                    reloadData={this.props.getAllTasks}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2>Minhas Tarefas</h2>
                </div>

                <List
                    dataSource={this.props.tasks}
                    renderItem={task => (
                        <List.Item
                            actions={[
                                <Button disabled type={'link'}>Detalhar</Button>,
                                <Button
                                    onClick={() => {
                                        this.refs.createOrUpdateTask.openModal(task)
                                    }} type={'link'}>
                                    Editar
                                </Button>]}>
                            <List.Item.Meta
                                title={task.title}
                                description={`Criada ${moment(task.createdAt).fromNow()} com a previsão de entrega para ${moment(task.expectedDate).format('DD/MM/YYYY')}. Foi atualizada pela última vez ${moment(task.updatedAt).fromNow()} e no momento ${task.responsible.username} ${this.getStatus(task.status)} a tarefa.`}
                            />
                        </List.Item>
                    )}

                />
            </Page>
        );
    }
}
const mapStateToProps = (state) => {

    const {
        requestTasksDone,
        requestTasksLoading,
        tasks,
    } = state.tasks;

    return {
        requestTasksDone,
        requestTasksLoading,
        tasks,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getAllTasks': TasksActions.getAllTasks,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Tarefas);
