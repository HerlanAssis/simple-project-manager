import { notification } from 'antd';

const NotificationWindow = ({ type = 'error', message = 'Ops', description = 'Algo deu errado, por favor tente novamente mais tarde.' }) => {
	notification[type]({
		message,
		description,
	});
};


export default NotificationWindow;
