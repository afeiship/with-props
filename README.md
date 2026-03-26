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

```tsx
import withProps from '@jswork/with-props';
import React from 'react';

interface ButtonProps {
  text: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ text, color = 'blue', size = 'medium' }) => {
  return (
    <button style={{ color, fontSize: size === 'small' ? '12px' : size === 'large' ? '20px' : '16px' }}>
      {text}
    </button>
  );
};

// 创建带有默认 props 的组件
const PrimaryButton = withProps(Button, {
  color: 'red',
  size: 'large'
});

const App: React.FC = () => {
  return (
    <div>
      {/* 使用默认 props */}
      <PrimaryButton text="Click me" />

      {/* 覆盖默认 props */}
      <PrimaryButton text="Cancel" color="gray" />
    </div>
  );
};
```

### Features

- **Type Safe**: Full TypeScript support with proper type inference
- **Props Merging**: Default props are overridden by provided props
- **Simple API**: Just pass component and default props
- **Zero Dependencies**: Lightweight and focused

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
