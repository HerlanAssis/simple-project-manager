import React from 'react';
import { Calendar } from 'antd';
import { Page } from '../../../../components';
import './styles.css';


class Agenda extends React.Component {
    onPanelChange(value, mode) {
        console.log(value, mode);
    }

    render() {
        return (
            <Page>
                <Calendar onPanelChange={this.onPanelChange} />
            </Page>
        );
    }
}

export default Agenda;
