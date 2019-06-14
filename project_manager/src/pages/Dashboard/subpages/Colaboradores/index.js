import React from 'react';
import { Charts } from 'ant-design-pro';
import { Avatar, Card, Spin } from 'antd';
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

class Colaboradores extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            colaboradores: {
                per_page: 0,
                total_itens: 0,
                current_page: 1,
                results: [],
            },
            graphs: {},
        }

    }

    componentDidMount() {
        this.setState({ loading: true });

        const { repo } = this.props.location.state;

        Api.BackendServer.get('pm/contributors/', { params: { repo_full_name: repo.full_name } }).then(response => {
            const colaboradores = response.data;
            const graphs = {};

            colaboradores.results.forEach(colaborador => {
                Api.BackendServer.get(`pm/commits/`, { params: { author: colaborador.login, repo_full_name: repo.full_name } }).then(response => {
                    const commits = response.data;
                    const graphData = commits.results.map((value, index) => ({
                        x: `Churn de ${moment(value.commit.author.date || value.committer.author.date).format('LLLL')}`,
                        y: value.stats.total,
                    }));

                    graphs[colaborador.login] = graphData;

                    this.setState({
                        graphs: { ...this.state.graphs, ...graphs }
                    });

                });
            });

            this.setState({ colaboradores, loading: false });
        })
    }

    renderItem(item) {
        return (
            <Card
                // title={repo.name}
                style={{ width: '100%' }}
            >
                <Card.Meta
                    avatar={<Avatar src={item.avatar_url} />}
                    title={item.name || item.login}
                // description="This is the description"
                />
                <Spin spinning={!this.state.graphs[item.login]} size={'large'}>
                    <Charts.MiniArea
                        line
                        animate={true}
                        color="#cceafe"
                        height={100}
                        data={this.state.graphs[item.login]}
                    />
                </Spin>
            </Card>
        )
    }

    onChange(page, pageSize) {
        this.setState({ loading: true });
        const { repo } = this.props.location.state;
        Api.BackendServer.get('pm/contributors/', { params: { repo_full_name: repo.full_name, page: page - 1 } }).then(response => {
            const colaboradores = response.data;
            const graphs = {};

            colaboradores.results.forEach(colaborador => {
                Api.BackendServer.get(`pm/commits/`, { params: { author: colaborador.login, repo_full_name: repo.full_name } }).then(response => {
                    const commits = response.data;
                    const graphData = commits.results.map((value, index) => ({
                        x: `Churn de ${moment(value.commit.author.date || value.committer.author.date).format('LLLL')}`,
                        y: value.stats.total,
                    }));

                    graphs[colaborador.login].data = graphData;

                    this.setState({
                        graphs: { ...this.state.graphs, ...graphs }
                    });

                });
            });

            this.setState({ colaboradores, loading: false });
        })
    }

    _keyExtractor = (item) => `${item.id}`

    render() {
        return (
            <Page
                pagination={{
                    pageSize: Number(this.state.colaboradores.per_page),
                    total: Number(this.state.colaboradores.total_itens),
                    current: Number(this.state.colaboradores.current_page) + 1,
                    onChange: (page, pageSize) => this.onChange(page, pageSize),
                    hideOnSinglePage: true,
                }}
                loading={this.state.loading}
            >
                <List
                    columns={3}
                    items={this.state.colaboradores.results}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={this._keyExtractor}
                />
            </Page>
        );
    }
}

export default Colaboradores;
