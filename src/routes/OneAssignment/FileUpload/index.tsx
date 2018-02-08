import DescriptionList from '@/components/common/DescriptionList';
import Markdown from '@/components/common/Markdown';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { OneSubmissionModel } from '@/models/one-submission.model';
import Feedback from '@/routes/OneAssignment/Common/FeedBack';
import Submissions from '@/routes/OneAssignment/Common/Submissions';
import { IAssignment, IConfigSubmission } from '@/types/api';
import { AssignmentTimeStatus, FileUploadKeys } from '@/types/constants';
import { IFileUploadConfig } from '@/types/OneAssignment/file-upload';
import { descriptionRender } from '@/utils/helpers';
import { Button, Card, notification, Tabs, Upload } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

const { TabPane } = Tabs;

interface IFileUploadProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class FileUpload extends React.Component<IFileUploadProps> {

  $$FileUpload = new OneSubmissionModel<string, IConfigSubmission<IFileUploadConfig, string>, {}>();

  @observable
  fileList: any[] = [];

  @observable
  isUploading = false;

  @observable
  isSubmitting = false;

  @action
  beforeUpload = (file: UploadFile) => {
    if (file.name !== this.assignment.config.filename) {
      notification.error({
        message: '文件名不符合要求',
        description: `该文件名 ${file.name} 不符合题目要求 ${this.assignment.config.filename}`
      });
      return false;
    }
    this.fileList = [ file ];
    return false;
  }

  @action
  handleFileRemove = () => {
    this.fileList = [];
  }

  @action
  startSubmitting = () => {
    this.isSubmitting = true;
  }

  @action
  finishSubmitting = () => {
    this.isSubmitting = false;
  }

  @computed
  get assignment() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.assignment as IAssignment<IFileUploadConfig>;
  }

  @computed
  get activeKey() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabActiveKey;
  }

  @computed
  get descriptionsList() {
    return [
      {
        term: '文件名',
        key: 'filename',
        icon: 'file',
        value: this.assignment.config.filename
      },
      {
        term: '满分',
        key: 'full-score',
        icon: 'check',
        value: `${this.assignment.config.standard_score} pts`
      }
    ];
  }

  async LoadOneSubmissionFromHistory(subCaId: number) {
    const { $OneAssignment } = this.props;
    await this.$$FileUpload.LoadOneSubmission({
      course_id: $OneAssignment!.assignment.course_id,
      ca_id: $OneAssignment!.assignment.ca_id,
      sub_ca_id: subCaId
    });
  }

  getClickHandler = (subCaId: number) => () => {
    const { $OneAssignment } = this.props;
    $OneAssignment!.changeTab(FileUploadKeys.GradeFeedback);
    this.LoadOneSubmissionFromHistory(subCaId);
  }

  async componentDidMount() {
    const { course_id, ca_id } = this.assignment;
    await Promise.all([
      this.$$FileUpload.LoadLastSubmission({ course_id, ca_id })
    ]);
  }

  async submitFlow() {
    const { $OneAssignment } = this.props;
    const { course_id, ca_id } = this.assignment;
    const { sub_asgn_id } = await this.$$FileUpload.FileUpload({ course_id, ca_id }, this.fileList[ 0 ]);

    await Promise.all([
      $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
      this.$$FileUpload.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
    ]);

    notification.success({
      message: '文件上传成功',
      description: `文件${this.fileList[ 0 ].name} 上传成功`
    });

    $OneAssignment!.changeTab(FileUploadKeys.GradeFeedback);

    if (!this.assignment.grade_at_end) {
      const count = await this.$$FileUpload.untilLastFinishJudging({
        course_id,
        ca_id,
        sub_ca_id: sub_asgn_id
      }, 2500, Infinity);

      await Promise.all([
        $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
        this.$$FileUpload.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
      ]);
    }

  }

  handleSubmit = async () => {
    this.startSubmitting();
    try {
      await this.submitFlow();
    } catch (error) {
      // throw error;
    }
    this.finishSubmitting();
    this.handleFileRemove();
  }

  @computed
  get FeedBackDetail() {
    const { course_id, ca_id } = this.assignment;
    const { sub_ca_id } = this.$$FileUpload.oneSubmission;
    const actions = [ (
      <a
        key={ 'download' }
        target={ '_blank' }
        href={ `/api/courses/${course_id}/assignments/${ca_id}/submissions/${sub_ca_id}/download` }
      >
        <Button type={ 'primary' } icon={ 'download' }>下载我的提交</Button>
      </a>
    ) ];
    return (
      <Card loading={ !this.$$FileUpload.isOneSubmissionLoaded } actions={ actions }>
        <Markdown source={ this.$$FileUpload.oneSubmission.report || '暂无评语' }/>
      </Card>
    );
  }

  render() {
    const { $OneAssignment } = this.props;
    return (
      <Tabs activeKey={ this.activeKey } tabBarStyle={ { display: 'none' } }>
        <TabPane key={ FileUploadKeys.Description } tab={ FileUploadKeys.Description }>
          <Card style={ { marginBottom: '1rem' } }>
            <Markdown source={ this.assignment.description || '这个出题人很懒...' }/>
          </Card>
          <Card>
            <DescriptionList title={ null } col={ 2 } style={ { marginBottom: '1rem' } }>
              { this.descriptionsList.map(descriptionRender) }
            </DescriptionList>
            <Upload
              accept={ this.assignment.config.filename }
              beforeUpload={ this.beforeUpload }
              fileList={ this.fileList.slice() }
              onRemove={ this.handleFileRemove }
            >
              <Button icon={ 'upload' }>选择文件</Button>
            </Upload>
            <Button
              style={ { marginTop: '1rem' } }
              type={ 'primary' }
              icon={ 'check' }
              loading={ this.isSubmitting }
              disabled={ !this.fileList.length || $OneAssignment!.timeStatus !== AssignmentTimeStatus.InProgressing }
              onClick={ this.handleSubmit }
            >上传
            </Button>
          </Card>
        </TabPane>
        <TabPane key={ FileUploadKeys.GradeFeedback } tab={ FileUploadKeys.GradeFeedback }>
          <Feedback submitAt={ this.$$FileUpload.submitAt } submission={ this.$$FileUpload.oneSubmission }>
            { this.FeedBackDetail }
          </Feedback>
        </TabPane>
        <TabPane key={ FileUploadKeys.Recordings } tab={ FileUploadKeys.Recordings }>
          <Submissions getClickHandler={ this.getClickHandler }/>
        </TabPane>
      </Tabs>
    );
  }
}
