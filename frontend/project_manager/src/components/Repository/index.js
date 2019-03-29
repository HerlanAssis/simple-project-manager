import React from 'react';
import { Icon, Popconfirm } from 'antd';
import { Charts } from 'ant-design-pro';
import { Api } from '../../services';
import moment from 'moment';


const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 50; i += 1) {
    const random = Math.random();
    visitData.push({
        x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('DD/MM/YYYY'),
        y: Math.floor(random * 100) + 10,
    });
}



class Repository extends React.Component {
    popconfirmPropsForAddMonitoring() {

        return (
            {
                title: 'Ativar monitoramento?',
                onConfirm: () => {
                    const { repo } = this.props;
                    Api.BackendServer.get('pm/watchers/add', { params: { repo_full_name: repo.full_name } }).then(response => {
                        console.log("watchers add", response);
                        if (this.props.refresh) this.props.refresh();
                    })
                },
            }
        )
    }

    popconfirmPropsForRemoveMonitoring() {
        return (
            {
                title: 'Desativar monitoramento?',
                onConfirm: () => {
                    const { repo } = this.props;
                    Api.BackendServer.get('pm/watchers/remove', { params: { repo_full_name: repo.full_name } }).then(response => {
                        console.log("watchers remove", response);
                        if (this.props.refresh) this.props.refresh();
                    })
                },
            }
        )
    }

    render() {
        const { match, history, repo } = this.props;
        const popconfirmProps = repo.has_in_watched ? this.popconfirmPropsForRemoveMonitoring() : this.popconfirmPropsForAddMonitoring();
        return (
            <div style={{ display: 'flex', flex: 9, flexDirection: 'column', height: '150px', width: '100%', marginBottom: '30px' }}>
                {/* Nome do projeto */}
                <div style={{ display: 'flex', flexDirection: 'row' }} className='project-head'>

                    <div style={{ flex: 8, backgroundColor: "red" }}>
                        <p className='one-line'>{repo.name}</p>
                    </div>

                    <div style={{ display: 'flex', flex: 2, backgroundColor: "yellow", alignItems: 'center', justifyContent: 'center' }}>
                        <Popconfirm placement="topRight" {...popconfirmProps} okText="Sim" cancelText="Não">
                            <Icon style={{ fontSize: '26px' }} type={repo.has_in_watched ? "eye" : "eye-invisible"} />
                        </Popconfirm>
                    </div>

                </div>

                <div style={{ display: 'flex', flex: 2 }}>
                    <div style={{ display: 'flex', flex: 2, flexDirection: 'row' }}>
                        <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'pink' }} />

                        <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'purple' }} />

                        <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'blue' }} />
                    </div>

                    <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                        <div onClick={() => {
                            history.push({
                                pathname: `${match.url}/${repo.name}/commits/`,
                                state: { repo }
                            })
                        }} style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'yellow', cursor: 'pointer' }}>
                            <p>COMMITS: {repo.num_contributors}</p>
                        </div>

                        <div onClick={() => {
                            history.push({
                                pathname: `${match.url}/${repo.name}/colaboradores/`,
                                state: { repo }
                            })
                        }} style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'orange', cursor: 'pointer' }}>
                            <p>CONTRIBUTORS: {repo.num_contributors}</p>
                        </div>
                    </div>

                </div>

                {/* Dados de gráfico */}
                <div style={{ flex: 1 }}>
                    <Charts.MiniArea
                        line
                        animate={true}
                        color="#cceafe"
                        height={50}
                        data={visitData}
                    />
                </div>
            </div>
        );
    };
}

export default Repository;