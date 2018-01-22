import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import './index.less';
import 'particles.js';
import { stores } from '@/models';
import { App } from '@/App';
import { notification } from 'antd';

notification.config({
  top: 24 + 64 // base + top-height
});


useStrict(true);


render((
  <Provider { ...stores }>
    <App />
  </Provider>
), document.getElementById('app'));

