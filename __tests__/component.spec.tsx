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

test('should accept custom props', () => {
  const DefaultCard = withProps(Card, { variant: 'elevated' });

  const element = <DefaultCard className="custom" id="test">Hello</DefaultCard>;

  expect(element.props.className).toBe('custom');
  expect(element.props.id).toBe('test');
  expect(element.props.children).toEqual('Hello');
});

test('should support forwardRef', () => {
  const DefaultCard = withProps(Card, { variant: 'elevated' });

  const ref = React.createRef<HTMLDivElement>();
  const element = <DefaultCard ref={ref}>Hello</DefaultCard>;

  expect(element.props.children).toEqual('Hello');
});

test('should work with complex props', () => {
  const StyledCard = withProps(Card, {
    variant: 'elevated',
    role: 'article',
  });

  const element = (
    <StyledCard className="cls-name" role="group" style={{ padding: '16px' }} aria-label="Card content">
      Card content
    </StyledCard>
  );

  expect(element.props.role).toBe('group');
  expect(element.props.style).toEqual({ padding: '16px' });
  expect(element.props['aria-label']).toBe('Card content');
});

test('should preserve children', () => {
  const DefaultCard = withProps(Card, { variant: 'elevated' });

  const element = (
    <DefaultCard>
      <span>Child 1</span>
      <span>Child 2</span>
    </DefaultCard>
  );

  expect(element.props.children).toEqual([
    <span>Child 1</span>,
    <span>Child 2</span>,
  ]);
});

test('should work with real React components', () => {
  const DefaultCard = withProps(Card, {
    variant: 'elevated',
    title: 'Default Title',
  });

  expect(DefaultCard.displayName).toBe('Card.withProps');

  const element = (
    <DefaultCard
      className="custom-card"
      data-testid="card"
      role="article"
      description="acbc"
    >
      <p>Card content</p>
    </DefaultCard>
  );

  expect(element.props.className).toBe('custom-card');
  expect(element.props['data-testid']).toBe('card');
  expect(element.props.role).toBe('article');
  expect(element.props.children).toEqual(<p>Card content</p>);
});

test('should override defaults from real components', () => {
  const DefaultCard = withProps(Card, {
    className: 'default-card',
    title: 'Default Title',
  });

  const element = (
    <DefaultCard className="custom-card" id="card-1" description="abc-desc">
      Content
    </DefaultCard>
  );

  expect(element.props.className).toBe('custom-card');
  expect(element.props.id).toBe('card-1');
  expect(element.props.children).toEqual('Content');
  expect(element.props.description).toBe('abc-desc');
});
