import React from 'react';
import { Row, Col } from 'antd';
import { Page } from '../../../../components';
import { Api } from '../../../../services';
import './styles.css';


class Projetos extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projetos: [],
        }
    }

    componentDidMount() {
        Api.BackendServer.get('github/user/repos/').then(response => {
            this.setState({ projetos: response.data });
        })
    }

    render() {

        return (
            <Page>
                {/* <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">col-6</div>
                    </Col>
                </Row> */}

                {this.state.projetos.map(value => (
                    <p>{value.name}</p>
                ))}
            </Page>
        );
    }
}

export default Projetos;
