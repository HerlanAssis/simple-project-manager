import React from 'react';
import { Button, Tooltip } from 'antd';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NotificationsActions } from '../../modules/Notifications';
// * END Redux imports *

const NOTIFICATIONS = {
  TELEGRAM: 'TELEGRAM',
  EMAIL: 'EMAIL',
};

class HabilitarDesabilitarNotificacoes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canReloadData: false,
    }
  }

  notificationTypeEnable = (type) => {
    if (this.props.watcher && this.props.watcher.notification) {
      const notification = this.props.watcher.notification.toUpperCase();
      return notification.includes(type.toUpperCase())
    }

    return false;
  }

  updateNotifications = (telegram, email) => {
    const { watcher } = this.props;

    if (watcher) {
      const notificationArray = [];

      if (telegram) {
        notificationArray.push(NOTIFICATIONS.TELEGRAM)
      }

      if (email) {
        notificationArray.push(NOTIFICATIONS.EMAIL)
      }

      this.props.updateWatcher({
        id: Number(watcher.id),
        notification: notificationArray.join(','),
      });

      this.setState({ canReloadData: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.requestWatcherDone && this.state.canReloadData) {
      if (nextProps.reloadData) nextProps.reloadData();
      this.setState({ canReloadData: false });
    }
  }

  render() {
    const telegramHabilidado = this.notificationTypeEnable(NOTIFICATIONS.TELEGRAM);
    const emailHabilidado = this.notificationTypeEnable(NOTIFICATIONS.EMAIL);
    const disable = this.props.watcher ? false : true;

    return (
      <div style={{ display: 'flex', height: '25px', alignItems: 'center', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', marginLeft: '5px' }}>
          <Tooltip placement="bottomLeft" title={`${emailHabilidado ? 'Desabilitar' : 'Habilitar'} notificações por email`}>
            <Button
              onClick={() => this.updateNotifications(telegramHabilidado, !emailHabilidado)}
              ghost={!emailHabilidado}
              disabled={disable}
              type="primary"
              icon="mail"
              size={'default'}
            />
          </Tooltip>
        </div>

        <div style={{ display: 'flex', marginLeft: '5px' }}>
          <Tooltip placement="bottomLeft" title={`${telegramHabilidado ? 'Desabilitar' : 'Habilitar'} notificações por telegram`}>
            <Button
              onClick={() => this.updateNotifications(!telegramHabilidado, emailHabilidado)}
              ghost={!telegramHabilidado}
              disabled={disable}
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
  // const {

  // } = state.tasks;

  const {
    requestWatcherDone,
    requestWatcherLoading,
    // watcher,
  } = state.notifications;

  return {
    requestWatcherDone,
    requestWatcherLoading,
    // watcher,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    'updateWatcher': NotificationsActions.updateWatcher,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HabilitarDesabilitarNotificacoes);
