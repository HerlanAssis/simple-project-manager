import React from 'react';
import { Calendar, Badge, Button } from 'antd';
import { Page, CreateOrUpdateTask } from '../../../../components';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../../../modules/Tasks';
// * END Redux imports *
import './styles.css';
import moment from 'moment';

const STATUS = {
    'TODO': 'default',
    'DOING': 'processing',
    'DONE': 'success',
    'BLOCKED': 'error',
}

const DotTask = ({ task, onClick }) => {
    return (
        <span style={{ flex: 1, display: 'flex' }} key={task.id}>
            <Button onClick={onClick} type="link" size={'small'} >
                <Badge status={STATUS[task.status]} text={task.title} />
            </Button>
        </span>
    );
}

class Agenda extends React.Component {

    componentDidMount() {
        this.props.getAllTasks();
    }

    onPanelChange(value, mode) {
        console.log(value, mode);
    }

    dateCellRender(value) {
        const tarefas = this.props.tasks.filter(item => {
            return moment(item.expectedDate).format('DD/MM/YYYY') === moment(value).format('DD/MM/YYYY');
        });

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {tarefas.map(task => (
                    <DotTask key={task.id} task={task} onClick={() => this.refs.createOrUpdateTask.openModal(task)} />
                ))}
            </div>
        );
    }

    monthCellRender(value) {
        const tarefas = this.props.tasks.filter(item => {
            return moment(item.expectedDate).format('MM/YYYY') === moment(value).format('MM/YYYY');
        });

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {tarefas.map(task => (
                    <DotTask key={task.id} task={task} onClick={() => this.refs.createOrUpdateTask.openModal(task)} />
                ))}
            </div>
        )
    }

    render() {
        return (
            <Page loading={this.props.requestTasksLoading}>
                <CreateOrUpdateTask ref={'createOrUpdateTask'} reloadData={this.props.getAllTasks} />

                <Calendar onPanelChange={this.onPanelChange} dateCellRender={(e) => this.dateCellRender(e)} monthCellRender={(e) => this.monthCellRender(e)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Agenda);
