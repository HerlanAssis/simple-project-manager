import React from 'react';
import { Table } from 'antd';
import { Page, } from '../../../../components';
import { Api } from '../../../../services'

import moment from 'moment';

import './styles.css';

const columns = [{
    title: 'Commiter',
    dataIndex: 'commiter',
}, {
    title: 'Additions',
    dataIndex: 'additions',
},
{
    title: 'Deletions',
    dataIndex: 'deletions',
},
{
    title: 'Churn',
    dataIndex: 'churn',
},
{
    title: 'Data',
    dataIndex: 'date',

},
];

class Projeto extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            commits: {
                per_page: 0,
                total_itens: 0,
                current_page: 1,
                results: [],
            },
        }
    }

    componentDidMount() {
        this.setState({ loading: true })

        const { repo } = this.props.location.state;

        Api.BackendServer.get(`pm/commits/`, { params: { repo_full_name: repo.full_name } }).then(response => {
            const commits = response.data;

            console.log('commit', commits)

            const data = commits.results.map((value, index) => ({
                key: `${index}`,
                commiter: value.commit.author.name || value.committer.author.name,
                additions: value.stats.additions,
                deletions: value.stats.deletions,
                churn: value.stats.total,
                date: moment(value.commit.author.date || value.committer.author.date).format('LLLL'),
            }));

            this.setState({ loading: false, data, commits });
        });

    }

    onChange(pagination, filters, sorter) {
        this.setState({ loading: true });

        const { repo } = this.props.location.state;
        const { current } = pagination;

        Api.BackendServer.get(`pm/commits/${repo.name}`, { params: { page: current - 1 } }).then(response => {
            const commits = response.data;

            const data = commits.results.map((value, index) => ({
                key: `${index}`,
                commiter: value.commit.author.name || value.committer.author.name,
                additions: value.stats.additions,
                deletions: value.stats.deletions,
                churn: value.stats.total,
                date: moment(value.commit.author.date || value.committer.author.date).format('LLLL'),
            }));

            this.setState({ loading: false, data, commits });
        });
    }


    render() {
        return (
            <Page loading={this.state.loading}>
                <Table pagination={{
                    pageSize: Number(this.state.commits.per_page),
                    total: Number(this.state.commits.total_itens),
                    current: Number(this.state.commits.current_page) + 1,
                    hideOnSinglePage: true,
                }}
                    columns={columns}
                    dataSource={this.state.data}
                    onChange={(pagination, filters, sorter) => this.onChange(pagination, filters, sorter)}
                />,
            </Page>
        );
    }
}

export default Projeto;

