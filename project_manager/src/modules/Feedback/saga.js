import { takeEvery } from 'redux-saga/effects';
import { NotificationWindow } from '../../services'

import * as TasksTypes from '../Tasks/types';
import * as NotificationTypes from '../Notifications/types';
import * as AuthenticationTypes from '../Authentication/types';


const taskSuccess = () => {
  NotificationWindow({ type: 'success', message: 'Tudo certo!', description: 'Sua tarefa foi salva.' });
}

const noteSuccess = () => {
  NotificationWindow({ type: 'success', message: 'Tudo certo!', description: 'Sua nota foi salva.' });
}

const tokenSuccess = () => {
  NotificationWindow({ type: 'success', message: 'Bem vindo!' });
}

const saga = [
  takeEvery(TasksTypes.CREATE_UPDATE_TASK_SUCCESS, taskSuccess),
  takeEvery(TasksTypes.CREATE_UPDATE_NOTE_SUCCESS, noteSuccess),
  takeEvery(AuthenticationTypes.REQUEST_TOKEN_SUCCESS, tokenSuccess),
]

export default saga;
