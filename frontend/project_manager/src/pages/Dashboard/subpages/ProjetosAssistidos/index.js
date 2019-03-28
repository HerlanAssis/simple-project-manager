import React from 'react';
import { Charts } from 'ant-design-pro';
import { Input } from 'antd';
import moment from 'moment';
import { Page, List } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';

const Search = Input.Search

const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 50; i += 1) {
    const random = Math.random();
    visitData.push({
        x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('DD/MM/YYYY'),
        y: Math.floor(random * 100) + 10,
    });
}

class ProjetosAssistidos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projetos: [],
            watchers: {
                // prev: '',
                // next: '',
                // limit: '',
                per_page: 0,
                total_itens: 0,
                current_page: 1,
                results: [],
            },
            search_repos: {
                per_page: 0,
                total_itens: 0,
                current_page: 1,
                results: [],
            },
            loading: false,
            enable_serach_result: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        Api.BackendServer.get('pm/watchers/').then(response => {
            console.log("watchers", response);
            this.setState({ watchers: response.data, loading: false });
        })
    }

    _keyExtractor = (item) => `${item.id}`

    renderItem(repo) {
        return (
            <div style={{ display: 'flex', flex: 9, flexDirection: 'column', height: '150px', width: '100%', marginBottom: '30px' }}>
                {/* Nome do projeto */}
                <div className='project-head'>
                    <p className='one-line'>{repo.name}</p>
                </div>

                <div style={{ display: 'flex', flex: 2 }}>
                    <div style={{ display: 'flex', flex: 2, flexDirection: 'row' }}>
                        <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'pink' }} />

                        <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'purple' }} />

                        <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'blue' }} />
                    </div>

                    <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                        <div onClick={() => {
                            this.props.history.push({
                                pathname: `${this.props.match.url}/commits/${repo.name}`,
                                state: { repo }
                            })
                        }} style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'yellow', cursor: 'pointer' }}>
                            <p>COMMITS: {repo.num_contributors}</p>
                        </div>

                        <div onClick={() => {
                            this.props.history.push({
                                pathname: `${this.props.match.url}/colaboradores/${repo.name}`,
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

                    {contributors.map(contributor => {
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

    onChange(page, pageSize) {
        this.setState({ loading: true });
        Api.BackendServer.get('pm/watchers/', { params: { page: page - 1 } }).then(response => {
            console.log("watchers", response);
            this.setState({ watchers: response.data, loading: false });
        })
    }

    render() {
        return (
            <Page
                loading={this.state.loading}
                pagination={{
                    pageSize: Number(this.state.watchers.per_page),
                    total: Number(this.state.watchers.total_itens),
                    current: Number(this.state.watchers.current_page) + 1,
                    onChange: (page, pageSize) => this.onChange(page, pageSize),
                    hideOnSinglePage: true,
                }}
            >

                <div style={{ display: 'flex', flex: 1, margin: '8px' }}>
                    <Search
                        size="large"
                        placeholder="Pesquise pelo nome do repositório"
                        onSearch={value => {
                            this.setState({ loading: true });
                            Api.BackendServer.get('pm/search/', { params: { reponame: value } }).then(response => {
                                this.setState({ loading: false });
                                this.setState({ search_repos: response.data, enable_serach_result: true })
                            })
                        }}
                        style={{ width: '100%' }}
                    />
                </div>

                {/* RESULTADOS DA PESQUISA  */}
                <div style={{ flex: 9 }}>
                    {this.state.enable_serach_result ?
                        <List
                            columns={2}
                            items={this.state.search_repos.results}
                            renderItem={(project) => this.renderItem(project)}
                            keyExtractor={this._keyExtractor}
                        />
                        :
                        < List
                            columns={2}
                            items={this.state.watchers.results}
                            renderItem={(project) => this.renderItem(project)}
                            keyExtractor={this._keyExtractor}
                        />
                    }
                </div>
            </Page>
        );
    }
}

export default ProjetosAssistidos;
