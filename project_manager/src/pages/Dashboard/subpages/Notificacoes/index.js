import React from 'react';
import { Page, List } from '../../../../components';

// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NotificationsActions } from '../../../../modules/Notifications';
// * END Redux imports *

import './styles.css';


class Notificacoes extends React.Component {

    componentDidMount() {
        this.props.getAllWatchers();
    }

    render() {
        return (
            <Page loading={this.props.requestAllWatchersLoading}>
                <List
                    items={this.props.watchers}
                    columns={1}
                    renderItem={(watcher) => <p>{watcher.vigilant.projectName}</p>}
                    keyExtractor={(watcher) => watcher.id}
                />
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        requestAllWatchersDone,
        requestAllWatchersLoading,
        watchers,
    } = state.notifications;

    return {
        requestAllWatchersDone,
        requestAllWatchersLoading,
        watchers,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getAllWatchers': NotificationsActions.getAllWachers,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Notificacoes);
