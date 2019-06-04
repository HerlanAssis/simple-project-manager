import React from 'react';
import { Page, List } from '../../../../components';
import moment from 'moment';

// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../../../modules/Tasks';
// * END Redux imports *

import './styles.css';


class Tarefas extends React.Component {

    render() {
        return (
            <Page loading={this.props.requestTasksLoading}>
                <List
                    items={this.props.tasks}
                    columns={1}
                    renderItem={(tasks) => <p>{tasks.title}</p>}
                    keyExtractor={(task) => task.id}
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
