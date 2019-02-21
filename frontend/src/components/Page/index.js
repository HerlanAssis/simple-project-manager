import React from 'react';
import { Layout, Spin } from 'antd';

import './styles.css'

const {
    Content,
} = Layout;

class Page extends React.PureComponent {

    static defaultProps = {
        loading: false,
        style: {
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 16px',
        },
    }

    render() {
        return (
            <Content style={this.props.style} className='content'>
                <Spin wrapperClassName={'spin'} spinning={this.props.loading} size={'large'}>
                    <Content style={this.props.style} className='page'>
                        <div style={{ overflowY: 'auto', height: '70vh', maxHeight: '70vh', width: '100%', padding: 24, background: '#fff' }}>
                            {this.props.children}
                        </div>
                    </Content>
                </Spin>
            </Content>
        );
    }

}

export default Page;