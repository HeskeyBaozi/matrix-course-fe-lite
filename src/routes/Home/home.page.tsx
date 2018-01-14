import React from 'react';
import { connect } from 'dva';

@connect()
export class HomePage extends React.PureComponent {
  render() {
    return (
      <div>
        Home
      </div>
    );
  }
}
