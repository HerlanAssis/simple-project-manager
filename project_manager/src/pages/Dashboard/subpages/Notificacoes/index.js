import React from 'react';
import { Page, CreateOrUpdateTask, List, HabilitarDesabilitarNotificacoes } from '../../../../components';
import { Button, Tooltip, Divider } from 'antd';
import moment from 'moment';

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

    notificationEnabled(term = '', notification = '') {
        return notification.toUpperCase().search(term.toUpperCase()) >= 0;
    }

    render() {
        return (
            <Page
                loading={this.props.requestAllWatchersLoading}
            >
                <List
                    columns={1}
                    items={this.props.watchers}
                    renderItem={(watcher) => (
                        <div>
                            <Divider><h1>{watcher.vigilant.projectName}</h1></Divider>

                            <div style={{ display: 'flex', flex: 1 }}>
                                <List
                                    columns={1}
                                    items={watcher.histories}
                                    renderItem={(history) => (
                                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <div style={{ display: 'flex', flex: 1 }}>
                                                <h3>{`Mensagem enviada ${moment(history.createdAt).fromNow()} via ${history.sources}.`}</h3>
                                            </div>

                                            <div style={{ display: 'flex', flex: 9 }}>
                                                <p>{history.message}</p>
                                            </div>
                                        </div>
                                    )}
                                    keyExtractor={(watcher) => watcher.id}
                                />
                            </div>
                        </div>
                    )}
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
