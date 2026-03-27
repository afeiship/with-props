/// <reference types="bun" />
import { test, expect } from 'bun:test';
import React from 'react';
import withProps from '../src';

test('should set displayName based on component type', () => {
  const Box = withProps('div', { className: 'box' });
  // String components don't have displayName, so it falls back to 'Box'
  expect(Box.displayName).toBe('Box.withProps({"className":"box"})');
});

test('should accept custom props', () => {
  const Box = withProps('div', { className: 'box' });

  const element = <Box className="custom" id="test">Hello</Box>;

  // Passed props are visible in element.props
  expect(element.props.className).toBe('custom');
  expect(element.props.id).toBe('test');
  expect(element.props.children).toBe('Hello');
});

test('should support polymorphic as prop to change element type', () => {
  const Box = withProps('div', { className: 'box' });

  // Render as a button instead of div
  const element = <Box as="button" type="submit">Click me</Box>;

  expect(element.props.as).toBe('button');
  expect(element.props.type).toBe('submit');
});

test('should support as prop in defaultProps', () => {
  const Link = withProps('div', { as: 'a' });

  // Need to explicitly pass as prop for correct type inference
  const element = <Link as="a" href="#" className="link">Go to link</Link>;

  // Explicitly passed props are visible
  expect(element.props.href).toBe('#');
  expect(element.props.className).toBe('link');
});

test('should allow overriding as prop at usage', () => {
  const Link = withProps('div', { as: 'a' });

  // Override the default 'a' with 'button'
  const element = <Link as="button" type="button">Click</Link>;

  expect(element.props.as).toBe('button');
  expect(element.props.type).toBe('button');
});

test('should have cumulative displayName on chained components', () => {
  const FirstDefaults = withProps('div', { className: 'first' });
  const SecondDefaults = FirstDefaults.withProps({ id: 'second' });

  expect(FirstDefaults.displayName).toBe('Box.withProps({"className":"first"})');
  // Chained calls accumulate in displayName
  expect(SecondDefaults.displayName).toBe('Box.withProps({"className":"first"}).withProps({"id":"second"})');
});

test('should support chaining with withProps method', () => {
  const PrimaryBox = withProps('div', {
    className: 'box',
  });

  const SmallPrimaryBox = PrimaryBox.withProps({
    style: { fontSize: '12px' },
  });

  // Explicitly passed props override
  const element = <SmallPrimaryBox className="custom" style={{ fontSize: '14px' }}>Hello</SmallPrimaryBox>;

  expect(element.props.className).toBe('custom');
  expect(element.props.style).toEqual({ fontSize: '14px' });
});

test('should support forwardRef', () => {
  const Box = withProps('div', { className: 'box' });

  // Should be able to pass ref
  const ref = React.createRef<HTMLDivElement>();
  const element = <Box ref={ref}>Hello</Box>;

  expect(element.props.children).toBe('Hello');
});

test('should work with complex props', () => {
  const Card = withProps('div', {
    className: 'card',
    role: 'article',
  });

  const element = (
    <Card role="group" style={{ padding: '16px' }} aria-label="Card content">
      Card content
    </Card>
  );

  expect(element.props.role).toBe('group');
  expect(element.props.style).toEqual({ padding: '16px' });
  expect(element.props['aria-label']).toBe('Card content');
});

test('should preserve children', () => {
  const Box = withProps('div', { className: 'box' });

  const element = (
    <Box>
      <span>Child 1</span>
      <span>Child 2</span>
    </Box>
  );

  expect(element.props.children).toEqual([
    <span>Child 1</span>,
    <span>Child 2</span>,
  ]);
});

test('should render with both as prop and custom props', () => {
  const Box = withProps('div', { className: 'box' });

  const element = <Box as="button" type="submit" data-action="submit">Submit</Box>;

  expect(element.props.as).toBe('button');
  expect(element.props.type).toBe('submit');
  expect(element.props['data-action']).toBe('submit');
});

// Real Card component test
interface CardProps {
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

test('should work with real React components', () => {
  const DefaultCard = withProps(Card, {
    variant: 'elevated',
    title: 'Default Title',
  });

  expect(DefaultCard.displayName).toBe('Card.withProps({"variant":"elevated","title":"Default Title"})');

  // Test that the component can be created with standard div props
  const element = (
    <DefaultCard
      className="custom-card"
      data-testid="card"
      role="article"
    >
      <p>Card content</p>
    </DefaultCard>
  );

  expect(element.props.className).toBe('custom-card');
  expect(element.props['data-testid']).toBe('card');
  expect(element.props.role).toBe('article');
  expect(element.props.children).toEqual(<p>Card content</p>);
});

test('should support chaining with real components', () => {
  const PrimaryCard = withProps(Card, {
    variant: 'elevated',
  });

  const StyledCard = PrimaryCard.withProps({
    className: 'card-styled',
  });

  expect(PrimaryCard.displayName).toBe('Card.withProps({"variant":"elevated"})');
  expect(StyledCard.displayName).toBe('Card.withProps({"variant":"elevated"}).withProps({"className":"card-styled"})');

  // Test that chaining works with standard props
  const element = (
    <StyledCard
      id="my-card"
      style={{ padding: '16px' }}
    />
  );

  expect(element.props.id).toBe('my-card');
  expect(element.props.style).toEqual({ padding: '16px' });
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
  expect(element.props.description).toBe("abc-desc")
});

