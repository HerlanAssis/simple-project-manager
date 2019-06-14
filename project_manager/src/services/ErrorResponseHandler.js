import NotificationWindow from './Notification';

const MIN_TIME = 5000; // 5 segundos
let timeout_id = null;

/**
 * Esta funcao controla a quantidade maxima de alertas de erro que pode ser exibida em um intervalo de tempo, neste caso 1 alerta a cada 5 segundos
 * @param {*} error 
 */
function minTimeForShowAlert(error, data) {

	clearTimeout(timeout_id);

	if (timeout_id === null) {
		NotificationWindow({ type: 'error' });
	}

	timeout_id = setTimeout(() => {
		timeout_id = null;
	}, MIN_TIME);
}

function ErrorResponseHandler(error) {
	if (error.response) {
		const { data, status } = error.response;

		if (status >= 400 && status < 500) {
			//1 error alert per 5 seconds
			minTimeForShowAlert(error, data);

			// // remover usuario da sessão por token invalido			
			// if (data.error === 'token_invalid') {
			// 	window.localStorage.removeItem('token');
			// 	window.location.reload();
			// };
		}
	}

	return Promise.reject(error);

}

export default ErrorResponseHandler;