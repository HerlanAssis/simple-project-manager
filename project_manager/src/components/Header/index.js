import React from 'react';

import {
  Layout, Menu, Icon, Tooltip, Modal, Avatar
} from 'antd';

import { URLS, KEYS } from '../../constants';
import { CreateOrUpdateTask } from '../../components';

import {
  NoticeIcon, HeaderDropdown
} from 'ant-design-pro';

import moment from 'moment';
import { array } from 'prop-types';

// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AuthActions } from '../../modules/Authentication';
import { TasksActions } from '../../modules/Tasks';
import { images } from '../../styles';
// * END Redux imports *

const {
  Header,
} = Layout;

const confirm = Modal.confirm;


class CustomHeader extends React.Component {

  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.atualizarDados = this.atualizarDados.bind(this);
  }

  static defaultProps = {
    tasks: [],
  }

  static propTypes = {
    tasks: array
  }

  componentDidMount() {
    this.props.getUser();
    this.atualizarDados();
  }

  atualizarDados() {
    setTimeout(() => {
      this.atualizarDados()
    }, 90000) // a cada 90 segundos

    this.props.getAllTasks();
    this.props.getLimits();
  }

  logout() {
    confirm({
      title: 'Sair do sistema?',
      content: 'Ao sair do sistema sua sessão será encerrada.',
      okText: 'Sair',
      cancelText: 'Cancelar',
      onOk: () => {
        this.props.logout({ token_key: KEYS.TOKEN_KEY });
      },
      onCancel: () => { },
    });
  }

  render() {
    const { limits } = this.props;

    const rate_limit = parseInt((limits.core.remaining / limits.core.limit) * 100);
    const reset = limits.core.reset;

    const menu = (
      <Menu selectedKeys={[]} onClick={this.logout}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          Logout
          </Menu.Item>
      </Menu>
    );

    let task_expires_today = this.props.tasks.filter(task => task.expiresToday);

    return (
      <Header style={{ display: 'flex', backgroundColor: '#fff', padding: 10 }}>
        <CreateOrUpdateTask ref={'createOrUpdateTask'} reloadData={this.atualizarDados} />
        <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
          {/* <Progress width={100} successPercent={0} percent={100} showInfo /> */}

          <div style={{ width: 'auto', marginLeft: 10, textAlign: 'center' }}>
            <p>Foi utilizado {100 - rate_limit}% da sua cota, ela será renovada {moment.unix(reset).fromNow()}.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end', }}>

          <div style={{ marginRight: 20 }}>
            <Tooltip placement="bottomRight" title={"Ajuda"}>
              <a
                target="_blank"
                href={URLS.GITHUB_REPO_URL}
                rel="noopener noreferrer"
              >
                <Icon type="question-circle-o" style={{ fontSize: 24 }} />
              </a>
            </Tooltip>
          </div>

          <div style={{ marginRight: 20 }}>
            <NoticeIcon ref={'noticeIcon'}
              bell={<Icon type="bell" style={{ fontSize: 24 }} />}
              count={task_expires_today.length}
              onItemClick={(item, tabProps) => {
                item.onClick();
                this.refs.noticeIcon.onClear();
              }}
              loading={this.props.requestTasksLoading}
              locale={{
                emptyText: 'Nada a exibir',
                clear: 'Limpar',
                expires_today: 'Expiram hoje',
                // next_releases: 'Próximas entregas',
              }}
              clearClose
            >
              <NoticeIcon.Tab
                title="expires_today"
                count={task_expires_today.length}
                list={task_expires_today.map(task => {
                  return { title: task.title, onClick: () => { this.refs.createOrUpdateTask.openModal(task) } }
                })}
                emptyText={'Nada a exibir.'}
              />
              {/* <NoticeIcon.Tab
                title="next_releases"
                count={task_expires_today.length}
                list={task_expires_today.map(task => {
                  return { title: task.title, onClick: () => { this.refs.createOrUpdateTask.openModal(task) } }
                })}
                emptyText={'Nada a exibir.'}              
              /> */}
            </NoticeIcon>
          </div>

          <div style={{ marginRight: 20 }}>
            <HeaderDropdown overlay={menu}>
              <span style={{ display: "flex", justifyContent: 'space-around', alignItems: "center" }}>
                <Avatar style={{margin:'8px'}} size="large" src={this.props.user.avatar_url || images.user} alt="avatar" />
                <span>{this.props.user.username}</span>
              </span>
            </HeaderDropdown>
          </div>
        </div>
      </Header >
    )
  }
}

const mapStateToProps = (state) => {
  const {
    removeTokenLoading,
    removeTokenDone,

    requestUserLoading,
    requestUserDone,
    user,

    requestLimitsLoading,
    requestLimitsDone,
    limits,
  } = state.authentication;

  const {
    requestTasksDone,
    requestTasksLoading,
    tasks,
  } = state.tasks;

  return {
    requestTasksDone,
    requestTasksLoading,
    tasks,

    removeTokenLoading,
    removeTokenDone,

    requestUserLoading,
    requestUserDone,
    user,

    requestLimitsLoading,
    requestLimitsDone,
    limits,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    'logout': AuthActions.authLogout,
    'getUser': AuthActions.getUser,
    'getLimits': AuthActions.getLimits,
    'getAllTasks': TasksActions.getAllTasks,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader);
