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

test('should set displayName based on component type', () => {
  const DefaultCard = withProps(Card, { variant: 'elevated' });
  expect(DefaultCard.displayName).toBe('Card.withProps');
});

test('should have cumulative displayName on chained components', () => {
  const FirstDefaults = withProps(Card, { variant: 'elevated' });
  const SecondDefaults = FirstDefaults.withProps({ className: 'first' });

  const firstElement = <FirstDefaults variant="outlined" />;
  const secondElement = <SecondDefaults variant="default" />;

  expect(FirstDefaults.displayName).toBe('Card.withProps');
  expect(SecondDefaults.displayName).toBe('Card.withProps.withProps');
  expect(firstElement.props.variant).toBe("outlined")
  expect(secondElement.props.variant).toBe("default")
});
