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

test('should support chaining with withProps method', () => {
  const PrimaryCard = withProps(Card, {
    variant: 'elevated',
  });

  const SmallPrimaryCard = PrimaryCard.withProps({
    style: { fontSize: '12px' },
  });

  const element = <SmallPrimaryCard className="custom" style={{ fontSize: '14px' }}>Hello</SmallPrimaryCard>;

  expect(element.props.className).toBe('custom');
  expect(element.props.style).toEqual({ fontSize: '14px' });
});

test('should support chaining with real components', () => {
  const PrimaryCard = withProps(Card, {
    variant: 'elevated',
  });

  const StyledCard = PrimaryCard.withProps({
    className: 'card-styled',
  });

  expect(PrimaryCard.displayName).toBe('Card.withProps');
  expect(StyledCard.displayName).toBe('Card.withProps.withProps');

  const element = (
    <StyledCard
      id="my-card"
      style={{ padding: '16px' }}
    />
  );

  expect(element.props.id).toBe('my-card');
  expect(element.props.style).toEqual({ padding: '16px' });
});

test('should support chaining with intrinsic element strings', () => {
  const BaseDiv = withProps('div', { className: 'base' });
  const StyledDiv = BaseDiv.withProps({ style: { padding: '16px' } });

  expect(BaseDiv.displayName).toBe('div.withProps');
  expect(StyledDiv.displayName).toBe('div.withProps.withProps');

  const element = <StyledDiv id="chained">Test</StyledDiv>;

  expect(element.props.id).toBe('chained');
  expect(element.props.children).toEqual('Test');
});
