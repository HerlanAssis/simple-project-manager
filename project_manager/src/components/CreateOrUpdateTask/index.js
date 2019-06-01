import React from 'react';
import { Form, Input, DatePicker, Button, Modal, TimePicker, Select, Cascader, InputNumber } from 'antd';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../modules/Tasks';
import { NotificationsActions } from '../../modules/Notifications';
// * END Redux imports *

const { Option } = Select;

class CreateOrUpdateTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      task: null,
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }

  openModal(task) {
    this.setState({
      showModal: true,
      task: task,
    })
  }

  closeModal() {
    this.setState({
      showModal: false,
      task: null,
    })
  }

  handleOk() {

  }

  static defaultProps = {
    vigilantes: [],
  }

  render() {
    const { vigilantes } = this.props;

    return (
      <Modal
        visible={this.state.showModal}
        title={this.state.task ? this.state.task.title : 'Nova Tarefa'}
        onOk={this.handleOk}
        onCancel={this.closeModal}
        footer={[
          <Button onClick={this.closeModal} key='cancelar'>
            Cancelar
                  </Button>,
          <Button onClick={this.handleOk} key='salvar' type="primary" loading={false}>
            Salvar
                  </Button>,
        ]}>
        <Form>
          <Form.Item
            label="Título"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Descrição"
          >
            <Input />
          </Form.Item>

          <Form.Item label="Situação">
            <Select defaultValue="TODO">
              <Option value="TODO">A fazer</Option>
              <Option value="DOING">Fazendo</Option>
              <Option value="BLOCKED">Bloqueada</Option>
              <Option value="DONE">Feito</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Responsável">
            <Select>
              {vigilantes.map(vigilant =>
                <Option key={vigilant.id} value={vigilant.observer.id}>{vigilant.observer.username}</Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item label="Data prevista de entrega">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const {

  } = state.tasks;

  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    'updateTask': TasksActions.updateTask,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CreateOrUpdateTask);
