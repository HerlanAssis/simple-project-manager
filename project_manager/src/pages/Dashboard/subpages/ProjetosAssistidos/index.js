import React from 'react';
import { Page, List, Repository } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';

class ProjetosAssistidos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projetos: [],
            stargazers: {
                // prev: '',
                // next: '',
                // limit: '',
                per_page: 0,
                total_itens: 0,
                current_page: 1,
                results: [],
            },
            loading: false,
            enable_serach_result: false,
        }

        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });

        Api.BackendServer.get('pm/stargazers/').then(response => {
            console.log("stargazers", response);
            this.setState({ stargazers: response.data, loading: false });
        })
    }

    refresh() {
        this.setState({ loading: true });

        Api.BackendServer.get('pm/stargazers/').then(response => {
            console.log("stargazers", response);
            this.setState({ stargazers: response.data, loading: false });
        })
    }

    _keyExtractor = (item) => `${item.id}`

    renderItem(repo) {
        return (
            <Repository repo={repo} match={this.props.match} history={this.props.history} refresh={this.refresh} />
        );
    }

    onChange(page, pageSize) {
        this.setState({ loading: true });
        Api.BackendServer.get('pm/stargazers/', { params: { page: page - 1 } }).then(response => {
            this.setState({ stargazers: response.data, loading: false });
        })
    }

    render() {
        return (
            <Page
                loading={this.state.loading}
                pagination={{
                    pageSize: Number(this.state.stargazers.per_page),
                    total: Number(this.state.stargazers.total_itens),
                    current: Number(this.state.stargazers.current_page) + 1,
                    onChange: (page, pageSize) => this.onChange(page, pageSize),
                    hideOnSinglePage: true,
                }}
            >
                {/* RESULTADOS DA PESQUISA  */}
                <div style={{ flex: 9 }}>
                    <List
                        columns={2}
                        items={this.state.stargazers.results}
                        renderItem={(project) => this.renderItem(project)}
                        keyExtractor={this._keyExtractor}
                    />
                </div>
            </Page>
        );
    }
}

export default ProjetosAssistidos;
