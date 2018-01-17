import './assets/fonts/proximanova.css';
import './assets/fonts/FiraCode-Regular.css';
import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import 'normalize.css';
import './index.less';
import { stores } from '@/models';
import { App } from '@/App';


useStrict(true);


render((
  <Provider { ...stores }>
    <App/>
  </Provider>
), document.getElementById('app'));

