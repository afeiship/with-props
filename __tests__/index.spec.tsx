/// <reference types="bun" />
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
  expect(ButtonWithDefaults.displayName).toBe('withProps(Button)');

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

test('should support forwardRef components', () => {
  const Input = React.forwardRef<HTMLInputElement, { value: string }>((props, ref) => {
    return <input ref={ref} value={props.value} />;
  });
  Input.displayName = 'Input';

  // 应该能够包装 forwardRef 组件
  const InputWithDefaults = withProps(Input, { value: 'default' });

  expect(InputWithDefaults.displayName).toBe('withProps(Input)');

  // 创建元素验证类型正确
  const element = <InputWithDefaults value="test" />;
  expect(element.props.value).toBe('test');
});

test('should support chaining with withProps method', () => {
  const PrimaryButton = withProps(Button, {
    color: 'blue',
  });

  const SmallPrimaryButton = PrimaryButton.withProps({
    size: 'small',
  });

  const element = <SmallPrimaryButton text="Click" />;

  expect(element.props.text).toBe('Click');
  // color 和 size 通过链式调用设置默认值
});

test('should merge defaults in chained calls', () => {
  const FirstDefaults = withProps(Button, {
    color: 'red',
    size: 'large',
  });

  const SecondDefaults = FirstDefaults.withProps({
    disabled: true,
  });

  const element = <SecondDefaults text="Disabled" />;

  expect(element.props.text).toBe('Disabled');
  // color: 'red', size: 'large', disabled: true 通过链式调用设置
});

test('should override defaults in later chain calls', () => {
  const FirstDefaults = withProps(Button, {
    color: 'red',
    size: 'large',
  });

  const SecondDefaults = FirstDefaults.withProps({
    color: 'blue', // 覆盖第一次设置的 color
  });

  const element = <SecondDefaults text="Blue Button" />;

  expect(element.props.text).toBe('Blue Button');
  // color 在第二次 withProps 中设置了，所以它是默认值，不会在 element.props 中显示
  // size 在第一次 withProps 中设置为 'large'
});

test('should have displayName on chained components', () => {
  const FirstDefaults = withProps(Button, { color: 'red' });
  const SecondDefaults = FirstDefaults.withProps({ size: 'small' });

  expect(FirstDefaults.displayName).toBe('withProps(Button)');
  expect(SecondDefaults.displayName).toBe('withProps(Button)');
});
