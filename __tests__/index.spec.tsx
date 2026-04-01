/// <reference types="bun" />
import { test, expect } from 'bun:test';
import React, { HTMLAttributes } from 'react';
import withProps from '../src';

// Real Card component test
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

test('should accept custom props', () => {
  const DefaultCard = withProps(Card, { variant: 'elevated' });

  const element = <DefaultCard className="custom" id="test">Hello</DefaultCard>;

  expect(element.props.className).toBe('custom');
  expect(element.props.id).toBe('test');
  expect(element.props.children).toEqual('Hello');
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

test('should support chaining with intrinsic element strings', () => {
  const BaseDiv = withProps('div', { className: 'base' });
  const StyledDiv = BaseDiv.withProps({ style: { padding: '16px' } });

  expect(BaseDiv.displayName).toBe('div.withProps');
  expect(StyledDiv.displayName).toBe('div.withProps.withProps');

  const element = <StyledDiv id="chained">Test</StyledDiv>;

  expect(element.props.id).toBe('chained');
  expect(element.props.children).toEqual('Test');
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

// Type test: should preserve literal types when component props are crossed with HTML props
test('should preserve literal types with HTMLAttributes cross types', () => {
  // Simulate antd Button type: ButtonProps & HTMLButtonProps
  // where HTMLAttributes has `type: string` which can widen the type
  interface ButtonProps {
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    danger?: boolean;
    loading?: boolean;
    children?: React.ReactNode;
  }

  // HTMLAttributes<HTMLButtonElement> has `type: string`
  // This simulates the real antd Button scenario
  const MockButton: React.FC<ButtonProps & React.HTMLAttributes<HTMLButtonElement>> = () => null;

  // When using withProps, the literal type 'primary' should be preserved
  // and not widened to string by HTMLAttributes
  const PrimaryButton = withProps(MockButton, { type: 'primary' });

  // Extract the props type for verification
  type PrimaryButtonProps = React.ComponentProps<typeof PrimaryButton>;

  // Type assertions to verify literal type is preserved
  const typeTest1: PrimaryButtonProps['type'] = 'primary'; // ✅ Should work
  const typeTest2: PrimaryButtonProps['type'] = undefined; // ✅ Should work (optional)

  // These should cause type errors:
  // @ts-expect-error - 'invalid' is not a valid type
  const typeTestError1: PrimaryButtonProps['type'] = 'invalid';

  // @ts-expect-error - 'submit' is not in ButtonProps type (even though HTMLAttributes allows it)
  const typeTestError2: PrimaryButtonProps['type'] = 'submit';

  // Verify the component works correctly
  const element1 = <PrimaryButton />; // Uses default type='primary'
  const element2 = <PrimaryButton type="link" />; // Explicitly set
  const element3 = <PrimaryButton danger />; // Other props work

  expect(element1).toBeTruthy();
  expect(element2).toBeTruthy();
  expect(element3).toBeTruthy();

  // Type assertions passed
  expect(typeTest1).toBe('primary');
  expect(typeTest2).toBeUndefined();
});

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
