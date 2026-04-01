/// <reference types="bun" />
import { test, expect } from 'bun:test';
import React, { HTMLAttributes } from 'react';
import withProps from '../src';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, footer, variant = 'default', children }) => {
  return (
    <div className={`card card--${variant}`} data-variant={variant}>
      {title && <div className="card__title">{title}</div>}
      {description && <div className="card__description">{description}</div>}
      {children && <div className="card__content">{children}</div>}
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

Card.displayName = 'Card';

// Tests for optional second parameter
test('should work without second parameter (component)', () => {
  const WrappedCard = withProps(Card);

  expect(WrappedCard.displayName).toBe('Card.withProps');

  const element = <WrappedCard variant="elevated" title="Hello">Content</WrappedCard>;

  expect(element.props.variant).toBe('elevated');
  expect(element.props.title).toBe('Hello');
  expect(element.props.children).toEqual('Content');
});

test('should work without second parameter (intrinsic element)', () => {
  const WrappedDiv = withProps('div');

  expect(WrappedDiv.displayName).toBe('div.withProps');

  const element = <WrappedDiv className="test" id="my-div">Hello</WrappedDiv>;

  expect(element.props.className).toBe('test');
  expect(element.props.id).toBe('my-div');
  expect(element.props.children).toEqual('Hello');
});

test('should support chaining after optional second parameter', () => {
  const WrappedCard = withProps(Card);
  const StyledCard = WrappedCard.withProps({ variant: 'elevated' });

  expect(WrappedCard.displayName).toBe('Card.withProps');
  expect(StyledCard.displayName).toBe('Card.withProps.withProps');

  const element = <StyledCard className="custom">Content</StyledCard>;

  expect(element.props.className).toBe('custom');
  expect(element.props.children).toEqual('Content');
});

test('should support forwardRef without second parameter', () => {
  const WrappedCard = withProps(Card);

  const ref = React.createRef<HTMLDivElement>();
  const element = <WrappedCard ref={ref}>Hello</WrappedCard>;

  expect(element.props.children).toEqual('Hello');
});
