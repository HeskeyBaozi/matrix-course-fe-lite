import { ILoginBody, ILoginErrorData, ILoginResult, ILoginSuccessData } from '@/api/interface';
import defaultAvatarUrl from '@/assets/images/avatar.jpg';
import Loading from '@/components/common/Loading';
import { LoginModel } from '@/models/login.model';
import { Avatar, Button, Form, Icon, Input, notification, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import classNames from 'classnames';
import { action, autorunAsync, computed, IReactionDisposer, observable, runInAction } from 'mobx';
import { inject, observer } from 'mobx-react';
import { asyncAction } from 'mobx-utils';
import React, { SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import styles from './index.less';

const { Item } = Form;

interface ILoginRouteProps extends RouteComponentProps<{}>, FormComponentProps {
  $Login?: LoginModel;
}

@inject('$Login')
@observer
class LoginRoute extends React.Component<ILoginRouteProps> {

  disposer: IReactionDisposer;

  @observable
  username = '';

  @observable
  isAvatarLoading = false;

  @observable
  isCaptchaLoading = false;

  @observable
  isEntering = false;

  @computed
  get shouldFetchAvatar() {
    return this.username.length > 5;
  }

  @computed
  get avatarUrl() {
    const { $Login } = this.props;
    return $Login!.avatarUrl ? $Login!.avatarUrl : defaultAvatarUrl;
  }

  @action
  observeUsername = (e: SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.username = e.currentTarget.value;
  }

  handleSubmit = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { form: { validateFields } } = this.props;
    validateFields({ force: true }, async (error, { username, password, captcha }: ILoginBody) => {
      if (!error) {
        await this.loginFlow({ username, password, captcha });
      }
    });
  }

  handleChangeCaptcha = () => {
    this.captchaFlow();
  }

  @asyncAction
  * loginFlow(body: ILoginBody) {
    this.isEntering = true;
    const { $Login } = this.props;
    const result: ILoginResult = yield $Login!.Login(body);
    if (result.status === 'OK') {
      const realname = result && result.data && (result.data as ILoginSuccessData).realname;
      notification.success({
        description: realname && `欢迎你, ${realname}` || `欢迎你`,
        message: '登录成功'
      });
    } else {
      if (result.status === 'WRONG_CAPTCHA' && $Login!.captchaUrl || result.status === 'WRONG_PASSWORD') {
        notification.error({
          description: result && result.msg || '登录错误',
          message: '登录失败'
        });
      }
    }

    if (result && (result.data as ILoginErrorData).captcha) {
      yield this.captchaFlow();
    }
    this.isEntering = false;
  }

  @asyncAction
  * captchaFlow() {
    this.isCaptchaLoading = true;
    yield new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    yield this.props.$Login!.Captcha();
    this.isCaptchaLoading = false;
  }

  componentDidMount() {
    const { $Login } = this.props;
    this.disposer = autorunAsync(() => {
      if (this.shouldFetchAvatar) {
        $Login!.FetchUserAvatar({ username: this.username });
      }
    }, 1500);
  }

  componentWillUnmount() {
    this.disposer();
  }

  render() {
    const { form: { getFieldDecorator: $ }, $Login } = this.props;

    const UserName = $('username', {
      rules: [ { required: true, message: '请输入用户名' }]
    })(<Input onChange={ this.observeUsername } placeholder={ 'Username' } prefix={ <Icon type={ 'user' } /> } />);

    const Password = $('password', {
      rules: [ { required: true, message: '请输入密码' }]
    })(<Input type={ 'password' } placeholder={ 'Password' } prefix={ <Icon type={ 'lock' } /> } />);

    const Captcha = $('captcha', {
      rules: [ { required: !!$Login!.captchaUrl, message: '请输入验证码' }]
    })(<Input placeholder={ '验证码' } prefix={ <Icon type='edit' /> } />);

    return (
      <Form onSubmit={ this.handleSubmit }>
        <Item>
          <div className={ styles.avatarWrapper }>
            <Loading isLoading={ this.isAvatarLoading } isFullScreen={ false } showTips={ false } />
            <img src={ this.avatarUrl } alt={ 'avatar' } />
          </div>
        </Item>
        <Item>{ UserName }</Item>
        <Item>{ Password }</Item>

        <Item className={ classNames({ [ styles.hidden ]: !$Login!.captchaUrl }) }>
          <div className={ styles.captchaWrapper }>
            { Captcha }
            <Tooltip title={ '点击以更换验证码' } trigger={ 'hover' }>
              <div className={ styles.captchaImageWrapper }>
                <Loading isLoading={ this.isCaptchaLoading } isFullScreen={ false } showTips={ false } />
                <img
                  onClick={ this.handleChangeCaptcha }
                  className={ styles.captcha }
                  src={ $Login!.captchaUrl }
                  alt={ 'captcha' }
                />
              </div>
            </Tooltip>
          </div>
        </Item>

        <div className={ styles.container }>
          <Button
            loading={ this.isEntering }
            className={ styles.submit }
            type={ 'primary' }
            htmlType={ 'submit' }
          >LOGIN
          </Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(LoginRoute);
