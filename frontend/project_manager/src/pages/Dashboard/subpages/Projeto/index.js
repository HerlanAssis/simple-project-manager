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
        }
    }

    componentDidMount() {
        this.setState({ loading: true })

        const { project } = this.props.location.state;

        Api.BackendServer.get(`pm/commits/${project.repo.name}`).then(response => {
            const commits = response.data;

            const data = commits.map((value, index) => ({
                key: `${index}`,
                commiter: value.commit.author.name || value.committer.author.name,
                additions: value.stats.additions,
                deletions: value.stats.deletions,
                churn: value.stats.total,
                date: moment(value.commit.author.date || value.committer.author.date).format('LLLL'),
            }));

            this.setState({ loading: false, data });
        });

    }

    onChange(pagination, filters, sorter) {
        console.log('params', pagination, filters, sorter);
    }


    render() {
        return (
            <Page loading={this.state.loading}>
                <Table columns={columns} dataSource={this.state.data} onChange={this.onChange} />,
            </Page>
        );
    }
}

export default Projeto;

