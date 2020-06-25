import React from 'react';
import { Layout, Spin, Pagination } from 'antd';

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
        const { children, pagination, style, loading } = this.props;
        // defaultCurrent={6} total={500}
        return (
            <Content style={style} className='content'>
                <Spin wrapperClassName={'spin'} spinning={loading} size={'large'}>
                    <div style={style} className='page'>
                        {children}
                        {pagination && <Pagination {...pagination} style={{ display: 'flex', justifyContent: 'flex-end' }}  />}
                    </div>
                </Spin>
            </Content>
        );
    }

}

export default Page;