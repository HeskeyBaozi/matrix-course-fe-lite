import path from 'path';

export default {
  entry: './src/entry-client.tsx',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ['import', { libraryName: 'antd-design-pro', libraryDirectory: 'lib' }]
  ],
  theme: './src/theme.js',
  browserslist: [
    '> 1%',
    'last 2 versions',
    'not ie <= 8'
  ],
  alias: {
    '@': resolve('src')
  },
  html: {
    template: './src/index.ejs'
  },
  env: {
    development: {
      publicPath: '/',
      disableCSSSourceMap: true,
      define: {
        'process.env': { NODE_ENV: '"development"' }
      },
      devtool: 'eval-source-map',
      proxy: {
        "/api/*": {
          "target": "http://test.vmatrix.org.cn",
          "secure": false,
          "changeOrigin": true,
          "cookieDomainRewrite": "",
          "ws": true
        }
      }
    },
    production: {
      publicPath: '/',
      define: {
        'process.env': { NODE_ENV: '"production"' }
      },
      devtool: '#source-map'
    }
  }
}

function resolve(...dirs) {
  return path.resolve(__dirname, ...dirs);
}
