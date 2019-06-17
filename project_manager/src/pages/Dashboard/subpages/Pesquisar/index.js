import React from 'react';
import { Input, List } from 'antd';
import { Page, Repository } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';

const Search = Input.Search

class Pesquisar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search_repos: {
                per_page: 0,
                total_itens: 0,
                current_page: 1,
                results: [],
            },
            last_search: null,
            loading: false,
            done: false,
        }

        this.refresh = this.refresh.bind(this);
    }

    _keyExtractor = (item) => `${item.id}`

    renderItem(repo) {
        return (
            <Repository repo={repo} match={this.props.match} history={this.props.history} refresh={this.refresh} />
        );
    }

    refresh() {
        if (this.state.last_search) {
            this.setState({ loading: true });
            Api.BackendServer.get('pm/search/', { params: { reponame: this.state.last_search } }).then(response => {
                this.setState({ loading: false, search_repos: response.data })
            });
        }
    }

    onChange(page, pageSize) {
        this.setState({ loading: true });
        Api.BackendServer.get('pm/search/', { params: { page: page - 1 } }).then(response => {
            this.setState({ search_repos: response.data, loading: false });
        })
    }

    render() {
        return (
            <Page
                loading={this.state.loading}
                pagination={{
                    pageSize: Number(this.state.search_repos.per_page),
                    total: Number(this.state.search_repos.total_itens),
                    current: Number(this.state.search_repos.current_page) + 1,
                    onChange: (page, pageSize) => this.onChange(page, pageSize),
                    hideOnSinglePage: true,
                }}
            >

                <div style={{ display: 'flex', flex: 1, margin: '8px' }}>
                    <Search
                        size="large"
                        placeholder="Pesquise pelo nome do repositório"
                        onSearch={value => {
                            this.setState({ loading: true, done: false });
                            Api.BackendServer.get('pm/search/', { params: { reponame: value } }).then(response => {
                                this.setState({ loading: false, done: true, last_search: value, search_repos: response.data })
                            })
                        }}
                        style={{ width: '100%' }}
                    />
                </div>

                {/* RESULTADOS DA PESQUISA  */}
                <div style={{ flex: 9 }}>
                    <List
                        locale={{
                            emptyText: this.state.done? 'Nenhum resultado encontrado para o termo pesquisado' : 'Não há dados'
                        }}
                        grid={{ gutter: 16, column: 2 }}
                        dataSource={this.state.search_repos.results}
                        renderItem={item => (
                            <List.Item>
                                {this.renderItem(item)}
                            </List.Item>
                        )}
                    />
                </div>
            </Page>
        );
    }
}

export default Pesquisar;
