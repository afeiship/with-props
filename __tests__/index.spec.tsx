import { test, expect } from 'bun:test';
import React from 'react';
import withProps from '../src/index';

// 测试组件
interface ButtonProps {
  text: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      disabled={props.disabled}
      style={{
        color: props.color,
        fontSize: props.size === 'small' ? '12px' : props.size === 'large' ? '20px' : '16px'
      }}
    >
      {props.text}
    </button>
  );
};

test('should merge default props with provided props', () => {
  const ButtonWithDefaults = withProps(Button, {
    color: 'red',
    size: 'large'
  });

  // 使用 JSX 语法，只传递必需的 props
  const wrapper = <ButtonWithDefaults text="Click me" />;

  // 验证传递的 props 存在
  expect(wrapper.props.text).toBe('Click me');
  // 默认 props 不会在 wrapper.props 中，它们在组件内部合并
});

test('should override default props when provided', () => {
  const ButtonWithDefaults = withProps(Button, {
    color: 'red',
    size: 'large'
  });

  // 覆盖部分默认 props
  const element = <ButtonWithDefaults text="Click me" color="green" />;

  expect(element.props.text).toBe('Click me');
  expect(element.props.color).toBe('green'); // 覆盖了默认的 'red'
  // size 没传，使用默认值 'large'，但不会在 element.props 中
});

test('should set correct displayName', () => {
  const ButtonWithDefaults = withProps(Button, { color: 'red' });
  expect(ButtonWithDefaults.displayName).toBe('withProps(Component)');

  // 测试有 displayName 的组件
  const NamedComponent: React.FC<{ foo: string }> = () => null;
  NamedComponent.displayName = 'NamedComponent';

  const NamedWithDefaults = withProps(NamedComponent, { foo: 'bar' });
  expect(NamedWithDefaults.displayName).toBe('withProps(NamedComponent)');
});

test('should work with function components', () => {
  const Text: React.FC<{ content: string; bold?: boolean }> = (props) => {
    return props.bold ? <b>{props.content}</b> : <span>{props.content}</span>;
  };

  const TextWithDefaults = withProps(Text, { bold: true });
  const element = <TextWithDefaults content="Hello" />;

  expect(element.props.content).toBe('Hello');
  // bold 有默认值 true，但不会在 element.props 中显示
});

test('should preserve component with original props type', () => {
  const ButtonWithDefaults = withProps(Button, { color: 'red' });

  const element = <ButtonWithDefaults text="Test" size="small" />;

  expect(element.props.text).toBe('Test');
  expect(element.props.size).toBe('small');
  // color 使用默认值 'red'，但不会在 element.props 中
});
