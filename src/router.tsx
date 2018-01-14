import React from 'react';
import { RouterAPI } from 'dva';
import { Router, Route, Switch } from 'dva/router';
import { HomePage } from '@/routes/Home/home.page';


export default function RouterConfig({ history, app }: RouterAPI) {
  return (
    <Router history={ history }>
      <Switch>
        <Route path="/" component={ HomePage }/>
      </Switch>
    </Router>
  );
}
