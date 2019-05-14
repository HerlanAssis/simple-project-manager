import React from 'react';
import { Page } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';


class Laboratorio extends React.Component {

    componentDidMount() {
        Api.BackendServer.get('pm/lab/').then(response => {
            console.log(response);
        })
    }

    lab() {
        const data = new URLSearchParams();
        data.append('command', 'clean_cache');

        Api.BackendServer.post('pm/lab/',
            data,
            {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(response => {
            console.log(response);
        })
    }

    render() {
        return (
            <Page>
                <button onClick={() => this.lab()}>Limpar Cache</button>
            </Page>
        );
    }
}

export default Laboratorio;
