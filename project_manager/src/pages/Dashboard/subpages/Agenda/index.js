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
            return moment(item.expectedDate).format('DD/MM/YYYY') === moment(value).format('DD/MM/YYYY');
        });

        return (
            <div>
                {tarefas.map(item => (
                    <span key={item.id}><Badge status={STATUS[item.status]} text={item.title} /></span>
                ))}
            </div>
        );
    }

    monthCellRender(value) {
        const tarefas = this.props.tasks.filter(item => {
            return moment(item.expectedDate).format('MM/YYYY') === moment(value).format('MM/YYYY');
        });

        return (
            <div>
                {tarefas.map(item => (
                    <p key={item.id}>
                        <span><Badge status={STATUS[item.status]} text={item.title} /></span>
                    </p>
                ))}
            </div>
        );
    }

    render() {
        return (
            <Page loading={this.props.requestTasksLoading}>
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
        'getTasks': TasksActions.getTasks,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Agenda);
