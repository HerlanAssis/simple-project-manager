import React from 'react';
import { Page } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';


class Laboratorio extends React.Component {

    componentDidMount() {
        Api.BackendServer.get('github/lab/').then(response => {
            console.log(response);
        })
    }

    lab() {
        Api.BackendServer.post('github/lab/').then(response => {
            console.log(response);
        })
    }

    render() {
        return (
            <Page>                
                <button onClick={() => this.lab()} >Limpar Cache</button>
            </Page>
        );
    }
}

export default Laboratorio;
