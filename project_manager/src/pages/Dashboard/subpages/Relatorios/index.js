import React from 'react';
import { Checkbox, Tabs, Icon, Button, Card } from 'antd';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../../../modules/Tasks';
// * END Redux imports *
import { Page } from '../../../../components';
import './styles.css';
import { Api } from '../../../../services';

const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;

class TabResumeReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            plainOptions: [],
            checkedList: [],
            indeterminate: false,
            checkAll: false,
        };
    }

    onChange = checkedList => {
        const { plainOptions } = this.state;

        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
            checkAll: checkedList.length === plainOptions.length,
        });
    };

    onCheckAllChange = e => {
        const { plainOptions } = this.state;

        this.setState({
            checkedList: e.target.checked ? plainOptions.map(item => item.value) : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    componentWillReceiveProps(nextProps) {
        if (!Object.is(this.props.taskmanagers, nextProps.taskmanagers)) {
            let plainOptions = []

            plainOptions = nextProps.taskmanagers.map((taskmanager) => ({ label: taskmanager.projectName, value: taskmanager.id }))

            this.setState({ plainOptions });
        }
    }

    render() {
        const { plainOptions } = this.state;

        return (
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', margin: '60px' }}>

                <div style={{ borderBottom: '1px solid #E9E9E9', height: '50px', }}>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >
                        Marcar todos
                    </Checkbox>
                </div>

                <br />

                <div style={{ display: 'flex', flex: 1 }}>
                    <CheckboxGroup
                        options={plainOptions}
                        value={this.state.checkedList}
                        onChange={this.onChange}
                    />
                </div>

                <br />

                <div style={{ display: 'flex', height: '50px', width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Button
                        disabled={this.state.checkedList.length === 0}
                        onClick={() => {
                            Api.BackendServer.get(`r/resume/${this.state.checkedList.map(item => item)}`);
                        }}
                        size={'large'}
                    >
                        Gerar relatório
                    </Button>
                </div>
            </div>
        )
    }
}

class TabDetailReport extends React.Component {
    render() {
        return (
            <Card style={{ margin: '60px' }}>
                {this.props.taskmanagers.map((taskmanager) => (
                    <Card.Grid
                        key={taskmanager.id}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        <Button
                            onClick={() => {
                                Api.BackendServer.get(`r/detail/${taskmanager.id}`);
                            }}
                            icon={'download'}
                            size={'large'}
                            type={'link'}
                        >
                            {taskmanager.projectName}
                        </Button>
                    </Card.Grid>
                ))}
            </Card>
        )
    }
}

class Relatorios extends React.Component {

    componentDidMount() {
        this.props.getAllTaskManagers()
    }

    render() {
        return (
            <Page loading={this.props.requestTaskManagersLoading}>
                <Tabs defaultActiveKey="1" onChange={() => { }}>
                    <TabPane tab={
                        <span>
                            <Icon type="table" />
                            Resumido
                        </span>
                    } key="1">
                        <TabResumeReport taskmanagers={this.props.taskmanagers} />
                    </TabPane>

                    <TabPane tab={
                        <span>
                            <Icon type="unordered-list" />
                            Detalhado
                        </span>
                    } key="2">
                        <TabDetailReport taskmanagers={this.props.taskmanagers} />
                    </TabPane>

                </Tabs>
            </Page>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        requestTaskManagersDone,
        requestTaskManagersLoading,
        taskmanagers,
    } = state.tasks;

    return {
        requestTaskManagersDone,
        requestTaskManagersLoading,
        taskmanagers,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        'getAllTaskManagers': TasksActions.getAllTaskManagers,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Relatorios);