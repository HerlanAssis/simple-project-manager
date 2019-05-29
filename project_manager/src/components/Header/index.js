import React from 'react';

import {
  Layout, Menu, Icon, Tooltip, Modal,
} from 'antd';

import { URLS, KEYS } from '../../constants';

import {
  NoticeIcon, HeaderDropdown
} from 'ant-design-pro';

import moment from 'moment';

// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AuthActions } from '../../modules/Authentication';
// * END Redux imports *

const {
  Header,
} = Layout;

const confirm = Modal.confirm;


class CustomHeader extends React.Component {

  constructor(props){
    super(props);

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.props.getLimits();
    this.props.getUser();
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

    return (
      <Header style={{ display: 'flex', backgroundColor: '#fff', padding: 10 }}>
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
            <NoticeIcon
              bell={
                <Icon type="bell" style={{ fontSize: 24 }} />
              }
              count={7}
              onItemClick={(item, tabProps) => {
                console.log(item, tabProps); // eslint-disable-line
                this.changeReadState(item, tabProps);
              }}
              loading={false}
              locale={{
                emptyText: '',
                clear: '',
                viewMore: '',
                notification: '',
                message: '',
                event: '',
              }}
              onClear={() => { }}
              onPopupVisibleChange={() => { }}
              onViewMore={() => ''}
              clearClose
            >
              <NoticeIcon.Tab
                count={1}
                list={[]}
                title="notification"
                emptyText={''}
                showViewMore
              />
              <NoticeIcon.Tab
                count={1}
                list={[]}
                title="message"
                emptyText={''}
                showViewMore
              />
              <NoticeIcon.Tab
                count={1}
                list={[]}
                title="event"
                emptyText={''}
                showViewMore
              />
            </NoticeIcon>
          </div>

          <div style={{ marginRight: 20 }}>
            <HeaderDropdown overlay={menu}>
              <span>{this.props.user.username}</span>
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

  return {
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader);
