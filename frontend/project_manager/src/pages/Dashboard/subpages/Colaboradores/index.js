import React from 'react';
import { Charts } from 'ant-design-pro';
import { Avatar } from 'antd';
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

    state = {
        loading: false,
        colaboradores: {
            per_page: 0,
            total_itens: 0,
            current_page: 1,
            results: [],
        },
    }

    componentDidMount() {
        this.setState({ loading: true });

        const { repo } = this.props.location.state;

        Api.BackendServer.get('pm/contributors/', { params: { repo_full_name: repo.full_name } }).then(response => {
            console.log(response);
            this.setState({ colaboradores: response.data, loading: false });
        })
    }

    renderItem(item) {
        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>

                <span className='contributors-p-one-line'>{item.name || item.login}</span>

                <div style={{ height: 150, display: 'flex', flex: 1, flexDirection: 'column' }}>
                    {/* <p>{item.name || item.login}</p> */}
                    <div style={{ flex: 1, display: 'flex', }}>

                        <div style={{ display: 'flex', margin: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar size={64} src={item.avatar_url} />
                        </div>

                        <div style={{ display: 'flex', flex: 1 }}>
                            <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'pink' }} />

                            <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'purple' }} />

                            <div style={{ display: 'flex', flex: 1, margin: 5, backgroundColor: 'blue' }} />
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <Charts.MiniArea
                            line
                            animate={true}
                            color="#cceafe"
                            height={60}
                            data={visitData}
                        />
                    </div>
                </div>
            </div>

        )
    }

    onChange(page, pageSize) {
        this.setState({ loading: true });
        const { repo } = this.props.location.state;
        Api.BackendServer.get('pm/contributors/', { params: { repo_full_name: repo.full_name, page: page - 1 } }).then(response => {
            this.setState({ colaboradores: response.data, loading: false });
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
