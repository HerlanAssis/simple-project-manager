import React from 'react';
import { Page } from '../../../../components';
import { Api } from '../../../../services'
import { Table } from 'antd';
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
                commiter: value.committer.login,
                additions: value.stats.additions,
                deletions: value.stats.deletions,
                churn: value.stats.deletions,
                date: moment(value.commit.author.date).format('LLLL'),
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
