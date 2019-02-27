import React from 'react';
import { Page, ProjectList } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';

class Projetos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projetos: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        Api.BackendServer.get('github/teste/').then(response => {
            console.log(response);
            // this.setState({ projetos: response.data, loading: false });            
        })
    }

    render() {

        return (
            <Page loading={this.state.loading}>
                <ProjectList projects={this.state.projetos} />
            </Page>
        );
    }
}

export default Projetos;
