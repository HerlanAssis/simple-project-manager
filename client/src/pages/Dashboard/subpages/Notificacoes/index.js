import React from 'react';
import { Page, HabilitarDesabilitarNotificacoes } from '../../../../components';
import { List } from 'antd';
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
                    itemLayout="vertical"
                    rowKey='id'
                    dataSource={this.props.watchers}
                    renderItem={watcher => (
                        <List.Item>
                            <HabilitarDesabilitarNotificacoes watcher={watcher} reloadData={this.props.getAllWatchers} />

                            <List.Item.Meta title={
                                <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <h2>{watcher.vigilant.projectName}</h2>
                                </div>
                            } />

                            <List
                                itemLayout="vertical"
                                rowKey='id'
                                dataSource={watcher.histories}
                                renderItem={history => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={history.message}
                                            description={`Mensagem enviada ${moment(history.createdAt).fromNow()} via ${history.sources}.`}
                                        />
                                    </List.Item>
                                )}
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
        'getAllWatchers': NotificationsActions.getAllWatchers,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Notificacoes);
