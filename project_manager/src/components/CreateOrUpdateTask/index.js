import React from 'react';
import { Form, Input, DatePicker, Button, Modal, TimePicker, Select, Cascader, InputNumber } from 'antd';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../modules/Tasks';
import { NotificationsActions } from '../../modules/Notifications';
// * END Redux imports *

import moment from 'moment';

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

class TaskForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }

  handleOk(e) {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.salvarTask(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { vigilantes } = this.props;
    let { task } = this.props;

    if (!task) task = {};

    return (
      <Form id="myForm" onSubmit={this.handleOk}>
        <Form.Item label="Título">
          {getFieldDecorator('title', {
            initialValue: task.title,
            rules: [{ required: true, message: 'Insira um título.' }],
          })(
            <Input />
          )}
        </Form.Item>

        <Form.Item label="Descrição" >
          {getFieldDecorator('description', {
            initialValue: task.description,
            rules: [{ message: 'Descreva a tarefa.' }],
          })(
            <Input.TextArea />
          )}
        </Form.Item>

        <Form.Item label="Situação">
          {getFieldDecorator('status', {
            initialValue: task.status || "TODO",
            rules: [{ required: true, message: 'Informe o status inicial.' }],
          })(
            <Select>
              <Option value="TODO">A fazer</Option>
              <Option value="DOING">Fazendo</Option>
              <Option value="BLOCKED">Bloqueada</Option>
              <Option value="DONE">Feito</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Responsável">
          {getFieldDecorator('responsibleId', {
            initialValue: task.responsibleId,
            rules: [{ required: false, message: 'Responsável pela tarefa.' }],
          })(
            <Select>
              {vigilantes.map(vigilant =>
                <Option key={vigilant.id} value={vigilant.observer.id}>{vigilant.observer.username}</Option>
              )}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Data prevista de entrega">
          {getFieldDecorator('expectedDate', {
            initialValue: task.expectedDate ? moment(task.expectedDate).format(dateFormat) : null,
            rules: [{ required: true, message: 'Data prevista de entrega.' }],
          })(
            <DatePicker format={dateFormat} style={{ width: '100%' }} />
          )}
        </Form.Item>
      </Form>
    )
  }
}

const FormTask = Form.create({ name: 'form_task', forwardRef: true })(TaskForm);

class CreateOrUpdateTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      task: null,
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.salvarTask = this.salvarTask.bind(this);
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
    });

    this.refs.taskForm.resetFields()
  }

  salvarTask(task) {
    const input = {
      title: task.title,
      description: task.description,
      status: task.status,
      expectedDate: task.expectedDate,
    }

    const params = {
      input,
      responsibleId: task.responsibleId,
    }

    if (this.state.task) {
      const update = {
        ...params,
        id: this.state.task.id,
      }

      this.props.updateTask(update);
    } else {
      const create = {
        ...params,
        taskmanagerId: this.props.taskmanager.id,
      }

      this.props.createTask(create);
    }

  }

  render() {
    let vigilantes = []

    if (Array.isArray(this.props.taskmanager.vigilantes)) {
      vigilantes = this.props.taskmanager.vigilantes;
    }

    return (
      <Modal
        visible={this.state.showModal}
        title={this.state.task ? this.state.task.title : 'Nova Tarefa'}
        onCancel={this.closeModal}
        footer={[
          <Button onClick={this.closeModal} key='cancelar'>
            Cancelar
          </Button>,
          <Button htmlType="submit" form="myForm" key='salvar' type="primary" loading={false}>
            Salvar
          </Button>,
        ]}>
        <FormTask ref={'taskForm'}
          salvarTask={this.salvarTask}
          vigilantes={vigilantes}
          task={this.state.task}
        />
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    requestTaskManagerLoading,
    requestTasksDone,
    requestTasksLoading,
    taskmanager,
  } = state.tasks;

  return {
    requestTaskManagerLoading,
    requestTasksDone,
    requestTasksLoading,
    taskmanager,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    'createTask': TasksActions.createTask,
    'updateTask': TasksActions.updateTask,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CreateOrUpdateTask);
