import React from 'react';
import { Page } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';


class Colaboradores extends React.Component {

    state = {
        loading: false,
    }

    componentDidMount() {
        this.setState({ loading: true });
        Api.BackendServer.get('github/contributors/').then(response => {
            console.log(response);
            this.setState({ projetos: response.data, loading: false });
        })
    }

    render() {
        return (
            <Page loading={this.state.loading}>
                This is a Colaboradores
            </Page>
        );
    }
}

export default Colaboradores;
