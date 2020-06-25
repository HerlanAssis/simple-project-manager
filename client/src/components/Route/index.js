import React from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom';
import { Exception } from 'ant-design-pro';

import { KEYS } from '../../constants';
// import { Exception } from '../../components';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        //logErrorToMyService(error, info);

        console.log(error, info)
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Exception
                    type='Problemas com o servidor!'
                    title='Ops!'
                    desc={'Desculpe, o servidor está reportando um erro'}
                    backText={'Voltar ao início'}
                />
            );
        }
        return this.props.children;
    }
}


const Custom = ({ component: Component, ...rest }) => (
    <ErrorBoundary>
        <Route
            {...rest} render={props => <Component {...props} />}
        />
    </ErrorBoundary>
);

const Private = ({ component: Component, ...rest }) => (
    <ErrorBoundary>
        <Route
            {...rest}
            render={props =>
                window.localStorage.getItem(KEYS.TOKEN_KEY) ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                            }}
                        />
                    )
            }
        />
    </ErrorBoundary>
);

export default {
    Private,
    Custom,
}