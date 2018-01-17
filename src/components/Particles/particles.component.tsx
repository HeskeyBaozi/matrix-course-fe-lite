import React from 'react';
import particlesConfig from '@/assets/jsons/particlesjs-config.json';
import 'particles.js'
import styles from './particles.component.less';

declare const particlesJS: (id: string, config: object) => void;
const id = 'PARTICLES_MATRIX';

export class Particles extends React.PureComponent {

  componentDidMount() {
    particlesJS(id, particlesConfig);
  }

  render() {
    return <div className={ styles.particles } id={ id }/>;
  }
}

