import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const LogMiddleware = ({ dispatch, getState }) => next => (action) => {
	const state = getState();
	console.log("0 - Ação", action);
	console.log("1 - Estado", state)
	return next(action);
};

const store = createStore(reducers, applyMiddleware(sagaMiddleware, LogMiddleware));

sagaMiddleware.run(rootSaga);

export default store;