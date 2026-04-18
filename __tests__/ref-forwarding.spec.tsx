/// <reference types="bun" />
import { test, expect } from 'bun:test';
import React from 'react';
import withProps from '../src';

// Regular function component (no forwardRef)
const PlainFC: React.FC<{ value: string }> = ({ value }) => <span>{value}</span>;
PlainFC.displayName = 'PlainFC';

// forwardRef component
const ForwardRefComp = React.forwardRef<HTMLDivElement, { value: string }>(
  ({ value }, ref) => <div ref={ref}>{value}</div>,
);
ForwardRefComp.displayName = 'ForwardRefComp';

test('should not pass ref to regular function component', () => {
  const Wrapped = withProps(PlainFC, { value: 'hello' });

  // Should not throw or warn — ref is silently ignored
  const ref = React.createRef<HTMLSpanElement>();
  const element = <Wrapped ref={ref} value="world" />;

  expect(element.props.value).toBe('world');
  expect(Wrapped.displayName).toBe('PlainFC.withProps');
});

test('should pass ref to forwardRef component', () => {
  const Wrapped = withProps(ForwardRefComp, { value: 'hello' });

  const ref = React.createRef<HTMLDivElement>();
  const element = <Wrapped ref={ref} value="world" />;

  expect(element.props.value).toBe('world');
  expect(Wrapped.displayName).toBe('ForwardRefComp.withProps');
});

test('should pass ref to intrinsic element', () => {
  const Wrapped = withProps('div', { className: 'styled' });

  const ref = React.createRef<HTMLDivElement>();
  const element = <Wrapped ref={ref} id="test">Hello</Wrapped>;

  expect(element.props.id).toBe('test');
  expect(element.props.children).toEqual('Hello');
});
