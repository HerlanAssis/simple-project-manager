import { takeEvery } from 'redux-saga/effects';
import { NotificationWindow } from '../../services'

import * as TasksTypes from '../Tasks/types';
// import * as NotificationTypes from '../Notifications/types';
import * as AuthenticationTypes from '../Authentication/types';
import { NotificationsTypes } from '../Notifications';


const taskSuccess = () => {
  NotificationWindow({ type: 'success', message: 'Tudo certo!', description: 'Sua tarefa foi salva.' });
}

const noteSuccess = () => {
  NotificationWindow({ type: 'success', message: 'Tudo certo!', description: 'Sua nota foi salva.' });
}

const tokenSuccess = () => {
  NotificationWindow({ type: 'success', message: 'Bem vindo!', description: ':D' });
}

const createWatcherSuccess = () => {
  NotificationWindow({ type: 'success', message: 'Tudo certo', description: 'Você tem um novo projeto monitorado.' });
}

const createWatcherError = () => {
  NotificationWindow({ type: 'warning', message: 'O código digitado está correto?', description: 'Caso continue a ver esta mensagem solicite seu código de monitoramento novamente.' });
}

const saga = [
  takeEvery(TasksTypes.CREATE_UPDATE_TASK_SUCCESS, taskSuccess),
  takeEvery(TasksTypes.CREATE_UPDATE_NOTE_SUCCESS, noteSuccess),
  takeEvery(AuthenticationTypes.REQUEST_TOKEN_SUCCESS, tokenSuccess),
  takeEvery(NotificationsTypes.REQUEST_CREATE_WATCHER_SUCCESS, createWatcherSuccess),

  takeEvery(NotificationsTypes.REQUEST_CREATE_WATCHER_ERROR, createWatcherError),
]

export default saga;
