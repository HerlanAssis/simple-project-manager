import React from 'react';
import { Page } from '../../../../components';
import { Api } from '../../../../services';
import { Tooltip, Card, Icon } from 'antd';
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
                <Card title="Limpar Cache" extra={
                    <Tooltip placement="bottomLeft" title={"Limpar o cache de dados"}>
                        <Icon type="question-circle-o" style={{ fontSize: 24 }} />
                    </Tooltip>
                } style={{ width: 300 }}>
                    <div onClick={()=>{
                        this.lab();
                    }} style={{ display: 'flex', flex: 1, cursor: 'pointer', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon style={{
                            fontSize: 84
                        }} type='delete' />
                    </div>
                </Card>
            </Page>
        );
    }
}

export default Laboratorio;
