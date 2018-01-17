declare module '*.less' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: object;
  export default content;
}


declare module 'dva/router' {
  export * from 'react-router-dom';
}


declare module '*.jpg' {
  const content: string;
  export default content;
}
