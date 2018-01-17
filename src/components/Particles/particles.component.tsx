import React from 'react';
import particlesConfig from '@/assets/jsons/particlesjs-config.json';
import 'particles.js'
import styles from './particles.component.less';

declare const particlesJS: (id: string, config: object) => void;
declare const pJSDom: any[];
const id = 'PARTICLES_MATRIX';

export default class Particles extends React.PureComponent {

  componentDidMount() {
    particlesJS(id, particlesConfig);
  }

  componentWillUnmount() {
    if (Array.isArray(pJSDom) && pJSDom.length) {
      pJSDom.forEach(pJS => {
        pJS.fn.vendors.destroypJS();
      });

      while (pJSDom.length) {
        pJSDom.pop();
      }
    }
  }

  render() {
    return <div className={ styles.particles } id={ id }/>;
  }
}

