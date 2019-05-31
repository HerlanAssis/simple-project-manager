import React from 'react';
import { Table } from 'antd';
import { Page, } from '../../../../components';
import { Api } from '../../../../services'
import moment from 'moment';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../../../modules/Tasks';
import { NotificationsActions } from '../../../../modules/Notifications';
// * END Redux imports *


import './styles.css';

const columns = [{
    title: 'Commiter',
    dataIndex: 'commiter',
}, {
    title: 'Additions',
    dataIndex: 'additions',
},
{
    title: 'Deletions',
    dataIndex: 'deletions',
},
{
    title: 'Churn',
    dataIndex: 'churn',
},
{
    title: 'Data',
    dataIndex: 'date',

},
];

class GerenciarTarefasPorProjeto extends React.Component {

    constructor(props) {
        super(props);
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


    render() {
        return (
            <Page>

            </Page>
        );
    }
}


const mapStateToProps = (state) => {
    const {

    } = state.tasks;

    const {

    } = state.notifications;

    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getTaskManager': TasksActions.getTaskManager,
        'getWacher': NotificationsActions.getWacher,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GerenciarTarefasPorProjeto);
