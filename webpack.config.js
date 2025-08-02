const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'content/contentScript': './src/content/contentScript.tsx',
    'background/background': './src/background/background.ts',
  },
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: ({ chunk }) => {
      if (chunk.name === 'content/contentScript') return 'content/contentScript.js';
      if (chunk.name === 'background/background') return 'background/background.js';
      return '[name].js';
    },
    clean: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};