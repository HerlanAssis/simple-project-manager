import React from 'react';
import { List } from 'antd';
import { Page, Repository } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';

class Projetos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projetos: [],
            repos: {
                // prev: '',
                // next: '',
                // limit: '',
                per_page: 0,
                total_itens: 0,
                current_page: 1,
                results: [],
            },
            loading: false,
        }

        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });

        Api.BackendServer.get('pm/repos/').then(response => {
            this.setState({ repos: response.data, loading: false });
        })
    }

    refresh() {
        this.setState({ loading: true });

        Api.BackendServer.get('pm/repos/').then(response => {
            this.setState({ repos: response.data, loading: false });
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
        Api.BackendServer.get('pm/repos/', { params: { page: page - 1 } }).then(response => {
            console.log("REPOS", response);
            this.setState({ repos: response.data, loading: false });
        })
    }

    render() {
        return (
            <Page
                loading={this.state.loading}
                pagination={{
                    pageSize: Number(this.state.repos.per_page),
                    total: Number(this.state.repos.total_itens),
                    current: Number(this.state.repos.current_page) + 1,
                    onChange: (page, pageSize) => this.onChange(page, pageSize),
                    hideOnSinglePage: true,
                }}
            >
                <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={this.state.repos.results}
                    renderItem={item => (
                        <List.Item>
                            {this.renderItem(item)}
                        </List.Item>
                    )}
                />
            </Page>
        );
    }
}

export default Projetos;
