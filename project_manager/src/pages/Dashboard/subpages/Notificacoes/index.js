import React from 'react';
import { Page } from '../../../../components';
import { List, Button, Tooltip } from 'antd';
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

    notificationEnabled(term='', notification = '') {
        return notification.toUpperCase().search(term.toUpperCase()) >= 0;
    }

    render() {
        return (
            <Page loading={this.props.requestAllWatchersLoading}>
                <List
                    dataSource={this.props.watchers}
                    renderItem={watcher => (
                        <List.Item style={{ display: 'flex', flex: 1, alignItems: 'flex-start', flexDirection: 'column' }}>

                            <List.Item.Meta
                                title={watcher.vigilant.projectName}
                                description={`Canais de notificação disponíveis: ${watcher.notification}.`}
                            />

                            <List
                                dataSource={watcher.histories}
                                renderItem={history => (
                                    <List.Item
                                        actions={[
                                            <Tooltip placement="bottomLeft" title={`O Email estava ${this.notificationEnabled('EMAIL', history.sources) ? 'ativo' : 'desativado'}.`}>
                                                <Button
                                                    disabled
                                                    icon='mail'
                                                    type={'ghost'} />
                                            </Tooltip>,
                                            <Tooltip placement="bottomLeft" title={`O TelegramBot estava ${this.notificationEnabled('TELEGRAM', history.sources) ? 'ativo' : 'desativado'}.`}>
                                                <Button
                                                    disabled
                                                    icon='robot'
                                                    type={'ghost'}
                                                />
                                            </Tooltip>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={moment(history.createdAt).fromNow()}
                                            description={history.message}
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
        'getAllWatchers': NotificationsActions.getAllWachers,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Notificacoes);
