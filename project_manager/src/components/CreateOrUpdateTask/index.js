import React from 'react';
import { Form, Input, DatePicker, Button, Modal, Select, Spin } from 'antd';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../modules/Tasks';
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
      <Form id="myFormTask" onSubmit={this.handleOk}>
        <Form.Item label="Título">
          {getFieldDecorator('title', {
            initialValue: task.title,
            rules: [
              { required: true, message: 'Insira um título.' },
              { max: 32, message: 'Tamanho máximo de 32 caracteres.' }
            ],
          })(
            <Input />
          )}
        </Form.Item>

        <Form.Item label="Descrição" >
          {getFieldDecorator('description', {
            initialValue: task.description,
            rules: [
              { message: 'Descreva a tarefa.' },
              { max: 256, message: 'Tamanho máximo de 256 caracteres.' },
            ],
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

        {vigilantes.length > 0 && !this.props.contributor && <Form.Item label="Responsável">
          {getFieldDecorator('responsibleId', {
            initialValue: task.responsible ? task.responsible.id : '',
            rules: [{ required: false, message: 'Responsável pela tarefa.' }],
          })(
            <Select>
              {vigilantes.map(vigilant =>
                <Option key={vigilant.id} value={vigilant.observer.id}>{vigilant.observer.username}</Option>
              )}
            </Select>
          )}
        </Form.Item>}

        <Form.Item label="Data prevista de entrega">
          {getFieldDecorator('expectedDate', {
            initialValue: task.expectedDate ? moment(task.expectedDate, 'YYYY-MM-DD') : null,
            rules: [{ required: true, message: 'Data prevista de entrega.' }],
          })(
            <DatePicker
              format={dateFormat}
              style={{ width: '100%' }}
              disabledDate={(current) => {
                // desabilita a escolha de datas já passadas
                return current && current < moment().subtract(1, 'days').endOf('day');
              }}
            />
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
      canCloseModalAfterSave: false,
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
      canCloseModalAfterSave: false,
    });

    this.refs.taskForm.resetFields();
  }

  salvarTask(task) {
    if (this.state.task) {
      this.updateTask(task)
    } else {
      this.createTask(task);
    }
  }

  createTask(task) {
    const newTask = {
      input: {
        title: task.title,
        description: task.description,
        status: task.status,
        expectedDate: task.expectedDate.format('YYYY-MM-DD'),
      },
      responsibleId: Number(task.responsibleId) || null,
      taskmanagerId: Number(this.props.taskmanager.id),
    }

    this.props.createTask(newTask);
  }


  updateTask(task) {
    const updatedTask = {
      input: {
        title: task.title,
        description: task.description,
        status: task.status,
        expectedDate: moment(task.expectedDate).format('YYYY-MM-DD'),
      },
      id: Number(this.state.task.id),
      responsibleId: Number(task.responsibleId),
    }

    this.props.updateTask(updatedTask);
  }

  static defaultProps = {
    loading: false,
    contributor: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.createTaskSuccess && this.state.canCloseModalAfterSave) {
      if (nextProps.reloadData) nextProps.reloadData();
      this.closeModal();
    }
  }

  render() {
    let vigilantes = []

    if (this.props.taskmanager && Array.isArray(this.props.taskmanager.vigilantes)) {
      vigilantes = this.props.taskmanager.vigilantes;
    }

    const loading = this.props.createTaskLoading || this.props.loading;

    return (
      <Modal
        visible={this.state.showModal}
        title={this.state.task ? this.state.task.title : 'Nova Tarefa'}
        onCancel={this.closeModal}
        footer={[
          <Button disabled={loading} onClick={this.closeModal} key='cancelar'>
            Cancelar
          </Button>,
          <Button
            onClick={() => this.setState({ canCloseModalAfterSave: true })}
            disabled={loading}
            form="myFormTask"
            key='salvar'
            type="primary"
            loading={false}
            htmlType='submit'
          >
            Salvar
          </Button>,
        ]}>
        <Spin spinning={loading}>
          {this.state.showModal && // force recriate form component
            <FormTask ref={'taskForm'}
              salvarTask={this.salvarTask}
              vigilantes={vigilantes}
              task={this.state.task}
              contributor={this.props.contributor}
            />
          }
        </Spin>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    requestTaskManagerLoading,
    taskmanager,

    createTaskLoading,
    createTaskSuccess,
  } = state.tasks;

  return {
    requestTaskManagerLoading,
    taskmanager,

    createTaskLoading,
    createTaskSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    'createTask': TasksActions.createTask,
    'updateTask': TasksActions.updateTask,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CreateOrUpdateTask);
