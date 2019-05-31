import React from 'react';
import { Calendar, Badge } from 'antd';
import { Page } from '../../../../components';
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

class Agenda extends React.Component {

    componentDidMount() {
        this.props.getTasks();
    }

    onPanelChange(value, mode) {
        console.log(value, mode);
    }

    dateCellRender(value) {
        const tarefas = this.props.tasks.filter(item => {
            return moment(item.createAt).format('DD/MM/YYYY') === moment(value).format('DD/MM/YYYY');
        });

        return (
            <ul className="events">
                {tarefas.map(item => (
                    <Badge status={STATUS[item.status]} text={item.title} />
                ))}
            </ul>
        );
    }

    render() {
        return (
            <Page>
                <Calendar onPanelChange={this.onPanelChange} dateCellRender={(e) => this.dateCellRender(e)} />
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
        'getTasks': TasksActions.getTasks,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Agenda);
