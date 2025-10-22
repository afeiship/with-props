# with-props
> Enhance component with preset properties.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install @jswork/with-props
```

## usage
```js
import withProps from '@jswork/with-props';
import React from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = (props) => {
  const { title, content } = props;
  return React.createElement('div', null,
    React.createElement('h1', null, title),
    React.createElement('p', null, content)
  );
};

// 使用 withProps 直接传递 defaultProps 和组件
const EnhancedComponent = withProps( MyComponent, { title: 'Default Title' });

const App: React.FC = () => {
  return React.createElement('div', null,
    React.createElement(EnhancedComponent, { content: 'Custom Content' })
  );
};

export default App;
```

## license
Code released under [the MIT license](https://github.com/afeiship/with-props/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/with-props
[version-url]: https://npmjs.org/package/@jswork/with-props

[license-image]: https://img.shields.io/npm/l/@jswork/with-props
[license-url]: https://github.com/afeiship/with-props/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/with-props
[size-url]: https://github.com/afeiship/with-props/blob/master/dist/index.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/with-props
[download-url]: https://www.npmjs.com/package/@jswork/with-props
