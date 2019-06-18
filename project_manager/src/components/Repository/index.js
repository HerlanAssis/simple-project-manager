import React from 'react';
import { Spin, Button, Card, Tooltip } from 'antd';
import { Charts } from 'ant-design-pro';
import { Api } from '../../services';
import moment from 'moment';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../modules/Tasks';

const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 50; i += 1) {
    const random = Math.random();
    visitData.push({
        x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('DD/MM/YYYY'),
        y: Math.floor(random * 100) + 10,
    });
}

const GerenciarOuVisualizarTarefas = ({ repo, match, history }) => {
    if (repo.is_owner) {
        return (
            <Button onClick={() => {
                history.push({
                    pathname: `${match.url}/${repo.name}/tarefas/`,
                    state: { repo }
                })
            }} type="link" size="large" icon="line-chart">
                Gerenciar Tarefas
            </Button>
        )
    }

    return (
        <Button onClick={() => {
            history.push({
                pathname: `${match.url}/${repo.name}/tarefas/`,
                state: { repo }
            })
        }} type="link" size="large" icon="line-chart">
            Visualizar Tarefas
        </Button>
    )
}

class Repository extends React.Component {
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
            graphData: []
        }
    }

    popconfirmPropsForAddMonitoring() {
        return (
            {
                title: 'Ativar monitoramento?',
                onConfirm: () => {
                    const { repo } = this.props;
                    Api.BackendServer.get('pm/stargazers/add', { params: { repo_full_name: repo.full_name } }).then(response => {
                        console.log("stargazers add", response);
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
                    Api.BackendServer.get('pm/stargazers/remove', { params: { repo_full_name: repo.full_name } }).then(response => {
                        if (this.props.refresh) this.props.refresh();
                    })
                },
            }
        )
    }

    componentDidMount() {
        const { repo } = this.props;

        this.setState({ loading: true });
        Api.BackendServer.get(`pm/commits/`, { params: { repo_full_name: repo.full_name } }).then(response => {
            const commits = response.data;

            // const data = commits.results.map((value, index) => ({
            //     additions: value.stats.additions,
            //     deletions: value.stats.deletions,
            //     churn: value.stats.total,
            //     date: moment(value.commit.author.date || value.committer.author.date).format('LLLL'),
            // }));

            const graphData = commits.results.map((value, index) => ({
                x: `Churn de ${moment(value.commit.author.date || value.committer.author.date).format('LLLL')}`,
                y: value.stats.total,
            }));

            this.setState({ loading: false, data: [], commits, graphData });
        });
    }

    render() {
        const { match, history, repo } = this.props;
        const popconfirmProps = repo.has_in_starred ? this.popconfirmPropsForRemoveMonitoring() : this.popconfirmPropsForAddMonitoring();
        return (
            <Card
                title={<Button icon='github' target='_blank' href={repo.html_url} type="link" size={'large'}>{repo.name}</Button>} extra={<GerenciarOuVisualizarTarefas
                    repo={repo}
                    match={match}
                    history={history} />}
                style={{ width: '100%' }}
                actions={[
                    <Tooltip placement="bottom" title={repo.has_in_starred ? 'Desfavoritar' : 'Favoritar'}><Button onClick={popconfirmProps.onConfirm} type={repo.has_in_starred ? 'primary' : 'ghost'} shape={'circle'} icon="star" /></Tooltip>,

                    <Tooltip placement="bottom" title={`${repo.num_contributors} Contribuidores`}><Button onClick={() =>
                        history.push({
                            pathname: `${match.url}/${repo.name}/colaboradores/`,
                            state: { repo }
                        })
                    } type={'link'} icon="user" /></Tooltip>,

                    <Tooltip placement="bottom" title={`${repo.num_commits} Commits`}><Button onClick={() => {
                        history.push({
                            pathname: `${match.url}/${repo.name}/commits/`,
                            state: { repo }
                        })
                    }} type={'link'} icon="upload" /></Tooltip>,
                ]}
            >
                <Spin spinning={this.state.loading} size={'large'}>
                    <Charts.MiniArea
                        line
                        animate={true}
                        color="#cceafe"
                        height={100}
                        data={this.state.graphData}
                    />
                </Spin>
            </Card>
        );
    };
}


const mapStateToProps = (state) => {
    const {
        requestTaskManagerDone,
        requestTaskManagerLoading,
        createTaskManagerDone,
        createTaskManagerLoading,
        taskManager,
    } = state.tasks;

    return {
        requestTaskManagerDone,
        requestTaskManagerLoading,
        createTaskManagerDone,
        createTaskManagerLoading,
        taskManager,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getTaskManager': TasksActions.getTaskManager
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Repository);
