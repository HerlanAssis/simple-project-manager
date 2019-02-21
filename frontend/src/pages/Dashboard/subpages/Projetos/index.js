import React from 'react';
import { Page } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';


class Projetos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projetos: [],
        }
    }

    componentDidMount() {
        Api.BackendServer.post('github/user/repos/').then(response => {
            console.log(response);
        })
    }

    render() {

        return (
            <Page>
                This is a Projetos
            </Page>
        );
    }
}

export default Projetos;
