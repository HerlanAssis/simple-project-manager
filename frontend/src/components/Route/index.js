import React from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom';
import { KEYS } from '../../constants';

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
            return <h1>Something went wrong.</h1>;
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