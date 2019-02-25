import React from 'react';
import { Layout, Spin } from 'antd';

import './styles.css'

const {
    Content,
} = Layout;

class Page extends React.PureComponent {

    static defaultProps = {
        loading: false,
        style: {},
    }

    render() {
        return (
            <Content style={this.props.style} className='content'>
                <Spin wrapperClassName={'spin'} spinning={this.props.loading} size={'large'}>
                    <div style={this.props.style} className='page'>
                        {this.props.children}
                    </div>
                </Spin>
            </Content>
        );
    }

}

export default Page;