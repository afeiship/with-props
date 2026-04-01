/// <reference types="bun" />
import { test, expect } from 'bun:test';
import React from 'react';
import withProps from '../src';

test('should support intrinsic element strings like div', () => {
  const StyledDiv = withProps('div', { className: 'styled' });

  expect(StyledDiv.displayName).toBe('div.withProps');

  const element = <StyledDiv id="test-div">Hello</StyledDiv>;

  // Default props are merged during render, not in element.props
  expect(element.props.id).toBe('test-div');
  expect(element.props.children).toEqual('Hello');

  // Verify default props are applied when rendered
  const rendered = React.createElement(StyledDiv, { id: 'test-div', children: 'Hello' });
  expect(rendered).toBeTruthy();
});

test('should support intrinsic element strings like span', () => {
  const StyledSpan = withProps('span', { className: 'text-red' });

  expect(StyledSpan.displayName).toBe('span.withProps');

  const element = <StyledSpan title="Tooltip">Content</StyledSpan>;

  expect(element.props.title).toBe('Tooltip');
  expect(element.props.children).toEqual('Content');

  // Verify default props are applied when rendered
  const rendered = React.createElement(StyledSpan, { title: 'Tooltip', children: 'Content' });
  expect(rendered).toBeTruthy();
});

test('should support forwardRef with intrinsic element strings', () => {
  const StyledDiv = withProps('div', { className: 'styled' });

  const ref = React.createRef<HTMLDivElement>();
  const element = <StyledDiv ref={ref}>Hello</StyledDiv>;

  // ref is a special prop that doesn't appear in element.props
  expect(element.props.children).toEqual('Hello');
});

test('should override defaults with intrinsic element strings', () => {
  const StyledDiv = withProps('div', {
    className: 'default-styled',
    role: 'article',
  });

  const element = (
    <StyledDiv className="custom-styled" role="group" aria-label="Div content">
      Content
    </StyledDiv>
  );

  expect(element.props.className).toBe('custom-styled');
  expect(element.props.role).toBe('group');
  expect(element.props['aria-label']).toBe('Div content');
});
