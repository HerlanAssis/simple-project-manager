import React from 'react';
import { Button } from 'antd';
import Page from '../Page';
import './styles.css';

import { images } from '../../styles';

class Exception extends React.Component {
    static defaultProps = {
        type: '403',
        title: 'Ops!',
        styles: {
            display: 'flex',
            flex: 1,
        }
    }

    onButtonClick(path) {
        window.location.replace(path);
    }

    render() {
        const { styles, title, description, type, actions } = this.props;

        return (
            <Page>
                <div style={styles} className='exception-content'>

                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', width: 'auto', height: 'auto' }}>
                        <img src={images.exception[type]} alt={'Imagem de descrição do erro'} />
                    </div>

                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', width: 'auto', height: 'auto' }}>
                        <h1>{title}</h1>
                        {description && <p>{description}</p>}
                        {actions && <div style={{ alignItems: 'flex-start' }}><Button onClick={() => this.onButtonClick(actions.path)}>{actions.name}</Button></div>}
                    </div>
                </div>
            </Page>
        )
    }
}

export default Exception;