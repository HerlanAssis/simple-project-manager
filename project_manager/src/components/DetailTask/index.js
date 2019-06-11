import React from 'react';
import { Button, Modal, List, Typography, Divider, Card, Statistic } from 'antd';
// * Redux imports *
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TasksActions } from '../../modules/Tasks';
// * END Redux imports *

import { FORMATS } from '../../constants';
import { CreateNote } from '../../components';

import moment from 'moment';

const { Title } = Typography;

class DetailTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      task: {},
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  openModal(task) {
    this.setState({
      showModal: true,
      task: task,
    });
    this.props.getNotes({ taskId: Number(task.id) });
  }

  closeModal() {
    this.setState({
      showModal: false,
      task: {},
    });
  }

  loadData() {
    this.props.getNotes({ taskId: Number(this.state.task.id) });
  }

  static defaultProps = {
    loading: false,
  }

  render() {
    const loading = this.props.loading;
    const { task } = this.state;

    return (
      <Modal
        visible={this.state.showModal}
        title={`Tarefa: ${task.title}`}
        onCancel={this.closeModal}
        footer={[
          <Button disabled={loading} onClick={this.closeModal} key='fechar'>
            Fechar
          </Button>,
        ]}>
        <div style={{ display: "flex", flex: 1, flexDirection: 'column' }}>
          <CreateNote reloadData={this.loadData} ref={'createNote'} />

          {task.description && <Title level={2}>{task.description}</Title>}

          {task.responsible && task.responsible.username &&
            <Title level={3}>
              {task.status} - {task.responsible.username}
            </Title>
          }

          {task.conclusionDate &&
            <Title level={4}>
              Concluído em: {moment(task.conclusionDate).format(FORMATS.DATA_PTBR_DMYHMS)}
            </Title>
          }

          <Divider />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Card>
                <Statistic title="Criada" value={moment(task.createdAt).from()} />
              </Card>

              <Card>
                <Statistic title="Atualizada" value={moment(task.updatedAt).fromNow()} />
              </Card>

              <Card>
                <Statistic title="Previsão" value={task.expectedDate ? moment(task.expectedDate).format(FORMATS.DATA_PTBR) : '?'} />
              </Card>
            </div>

          </div>
          <Divider />

          <div style={{ display: "flex", flex: 1, flexDirection: 'column' }}>
            <div style={{ display: 'flex', height: '50px', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                this.refs.createNote.openModal(task);
              }} type="primary" icon="plus" size={'default'} >
                Adicionar nova nota
              </Button>
            </div>

            <List
              loading={this.props.requestNotesLoading}
              itemLayout="vertical"
              rowKey='id'
              dataSource={this.props.notes}
              renderItem={note => (
                <List.Item extra={moment(note.createdAt).format(FORMATS.DATA_PTBR_DMYHMS)}>
                  <List.Item.Meta
                    title={note.description}
                    description={note.owner.username}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    requestNotesLoading,
    requestNotesDone,
    notes,
  } = state.tasks;

  return {
    requestNotesLoading,
    requestNotesDone,
    notes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    'getNotes': TasksActions.getNotes,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(DetailTask);
