import React from 'react';

import {
  Layout, Menu, Icon, Progress, Button, Modal, Tooltip, Avatar
} from 'antd';
import { KEYS, URLS } from '../../constants';

import {
  NoticeIcon, HeaderDropdown
} from 'ant-design-pro';

import moment from 'moment';

const {
  Header,
} = Layout;

class CustomHeader extends React.Component {

  render() {

    const { rate_limit, reset, logout } = this.props;

    const menu = (
      <Menu selectedKeys={[]} onClick={logout}>
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
              <span>{"HERLAN"}</span>
            </HeaderDropdown>
          </div>

        </div>

        {/* <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
            <div style={{ flex: 1 }}>
            </div>

            

        </div> */}

        {/* <div>
          

        </div> */}
      </Header>
    )
  }
}

export default CustomHeader;
