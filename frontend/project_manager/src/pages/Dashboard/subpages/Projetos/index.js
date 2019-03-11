import React from 'react';
import { Avatar } from 'antd';
import { Charts } from 'ant-design-pro';
import moment from 'moment';
import { Page, List } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';


const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 50; i += 1) {
    const random = Math.random();
    visitData.push({
        x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('DD/MM/YYYY'),
        y: Math.floor(random * 100) + 10,
    });
}

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
        Api.BackendServer.get('pm/projects/').then(response => {
            console.log(response);
            this.setState({ projetos: response.data, loading: false });
        })
    }

    _keyExtractor = (item) => `${item.repo.id}`

    renderItem(project) {
        return (
            <div onClick={() => {
                this.props.history.push({
                    pathname: `${this.props.match.url}/${project.repo.name}`,
                    state: { project }
                })
            }} style={{ display: 'flex', flex: 1, flexDirection: 'column', height: '150px', width: '100%', marginBottom: '30px', cursor: 'pointer' }}>
                {/* Nome do projeto */}
                <div className='project-head'>
                    <p className='one-line'>{project.repo.name}</p>
                </div>

                <div style={{ display: 'flex', flex: 3, flexDirection: 'row' }}>
                    <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'pink' }} />

                    <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'purple' }} />

                    <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'blue' }} />
                </div>

                {/* Dados de gráfico */}
                <div style={{ flex: 7, backgroundColor: "red" }}>
                    <Charts.MiniArea
                        line
                        animate={true}
                        color="#cceafe"
                        height={50}
                        data={visitData}
                    />
                </div>

                {/* <div id={'contributors'} style={{
                    flex: 3,
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    overflowY: 'hidden',
                    flexDirection: 'column',
                    // flexDirection: 'row',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    backgroundColor: 'red'
                }}>

                    {project.contributors.map(contributor => {
                        return (
                            <div key={`${contributor.id}`} style={{ margin: 5 }}>
                                <Avatar shape="square" size="default" src={contributor.avatar_url} />
                            </div>
                        );
                    })}
                </div> */}

                {/* Rodapé
            <div style={{ display: 'flex', flex: 2 }}>
                <div style={{ position: 'relative', flex: 1, width: 'auto', height: 'auto', backgroundColor: 'green' }}></div>
                <div style={{ position: 'relative', flex: 1, width: 'auto', height: 'auto', backgroundColor: 'blue' }}></div>
            </div> */}

            </div>
        );
    }

    render() {
        return (
            <Page loading={this.state.loading}>
                <List
                    columns={2}
                    items={this.state.projetos}
                    renderItem={(project) => this.renderItem(project)}
                    keyExtractor={this._keyExtractor}
                />
            </Page>
        );
    }
}

export default Projetos;
