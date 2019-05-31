import React from 'react';
import { Button, Tooltip } from 'antd';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../modules/Tasks';
import { NotificationsActions } from '../../modules/Notifications';
// * END Redux imports *

const NOTIFICATIONS = {
  TELEGRAM: 'Telegram',
  EMAIL: 'Email',
};

class HabilitarDesabilitarNotificacoes extends React.Component {
  notificationTypeEnable = (type) => {
    if (this.props.watcher && this.props.watcher.notification) {
      return this.props.watcher.notification.includes(type)
    }

    return false;
  }

  updateNotifications = (telegram, email) => {
    const { watcher } = this.props;

    const notificationArray = [];

    if (telegram) {
      notificationArray.push('TELEGRAM')
    }

    if (email) {
      notificationArray.push('EMAIL')
    }

    this.props.updateWatcher({
      id: Number(watcher.id),
      notification: notificationArray.join(','),
    })
  }

  render() {
    const { repo } = this.props;

    const telegramHabilidado = this.notificationTypeEnable(NOTIFICATIONS.TELEGRAM);
    const emailHabilidado = this.notificationTypeEnable(NOTIFICATIONS.EMAIL);

    return (
      <div style={{ display: 'flex', height: '25px', alignItems: 'center', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', marginLeft: '5px' }}>
          <Tooltip placement="bottomLeft" title={'Habilitar/Desabilitar notificações por email'}>
            <Button
              onClick={() => this.updateNotifications(telegramHabilidado, !emailHabilidado)}
              ghost={!emailHabilidado}
              type="primary"
              icon="mail"
              size={'default'}
            />
          </Tooltip>
        </div>

        <div style={{ display: 'flex', marginLeft: '5px' }}>
          <Tooltip placement="bottomLeft" title={'Habilitar/Desabilitar notificações por telegram'}>
            <Button
              onClick={() => this.updateNotifications(!telegramHabilidado, emailHabilidado)}
              ghost={!telegramHabilidado}
              type="primary"
              icon="robot"
              size={'default'}
            />
          </Tooltip>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {

  } = state.tasks;

  const {
    requestWatcherDone,
    requestWatcherLoading,
    watcher,
  } = state.notifications;

  return {
    requestWatcherDone,
    requestWatcherLoading,
    watcher,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    'updateWatcher': NotificationsActions.updateWatcher,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HabilitarDesabilitarNotificacoes);
