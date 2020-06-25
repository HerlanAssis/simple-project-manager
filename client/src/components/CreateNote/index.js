import React from 'react';
import { Form, Input, Button, Modal, Spin } from 'antd';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../modules/Tasks';
// * END Redux imports *

class NoteForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
  }

  handleOk(e) {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.salvarNote(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form id="myFormNote" onSubmit={this.handleOk}>

        <Form.Item label="Descrição" >
          {getFieldDecorator('description', {
            rules: [
              { required: true, message: 'Escreva sua anotação.' },
              { min: 10, message: 'Mínimo de 10 caracteres.' },
            ],
          })(
            <Input.TextArea />
          )}
        </Form.Item>
      </Form>
    )
  }
}

const FormNote = Form.create({ name: 'form_note', forwardRef: true })(NoteForm);

class CreateNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      task: null,
      canCloseModalAfterSave: false,
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.salvarNote = this.salvarNote.bind(this);
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

  salvarNote(note) {
    this.props.createNote({
      taskId: Number(this.state.task.id),
      input: {
        description: note.description,
      }
    });
  }

  static defaultProps = {
    loading: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.createNoteSuccess && this.state.canCloseModalAfterSave) {
      if (nextProps.reloadData) nextProps.reloadData();
      this.closeModal();
    }
  }

  render() {
    const loading = this.props.createNoteLoading || this.props.loading;

    return (
      <Modal
        visible={this.state.showModal}
        title={'Nova Nota'}
        onCancel={this.closeModal}
        footer={[
          <Button disabled={loading} onClick={this.closeModal} key='cancelar'>
            Cancelar
          </Button>,
          <Button
            onClick={() => this.setState({ canCloseModalAfterSave: true })}
            disabled={loading}
            form="myFormNote"
            key='salvar'
            type="primary"
            loading={false}
            htmlType='submit'
          >
            Salvar
          </Button>,
        ]}>
        <Spin spinning={loading}>
          <FormNote ref={'taskForm'}
            salvarNote={this.salvarNote}
          />
        </Spin>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    createNoteLoading,
    createNoteSuccess,
  } = state.tasks;

  return {
    createNoteLoading,
    createNoteSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    'createNote': TasksActions.createNote,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CreateNote);
