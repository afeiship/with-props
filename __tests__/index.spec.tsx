import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import withProps from '../src/index';

// Simple test component
const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props}>{children}</button>
);

// Component with ref
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <input ref={ref} {...props} />,
);
Input.displayName = 'Input';

describe('withProps', () => {
  describe('basic functionality', () => {
    it('should merge default props with provided props', () => {
      const ButtonWithDefaults = withProps(Button, { className: 'default-class', type: 'button' });
      render(<ButtonWithDefaults className="custom-class">Click me</ButtonWithDefaults>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should use default props when not overridden', () => {
      const ButtonWithDefaults = withProps(Button, { className: 'default-class', type: 'submit' });
      render(<ButtonWithDefaults>Click me</ButtonWithDefaults>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('default-class');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should override default props with provided props', () => {
      const ButtonWithDefaults = withProps(Button, { type: 'button', disabled: false });
      render(<ButtonWithDefaults type="submit" disabled>Click me</ButtonWithDefaults>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toBeDisabled();
    });

    it('should pass children correctly', () => {
      const ButtonWithDefaults = withProps(Button, { className: 'default-class' });
      render(<ButtonWithDefaults>Click me</ButtonWithDefaults>);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Click me');
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to the underlying component', () => {
      const InputWithDefaults = withProps(Input, { placeholder: 'Enter text' });
      const ref = React.createRef<HTMLInputElement>();

      render(<InputWithDefaults ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toHaveAttribute('placeholder', 'Enter text');
    });

    it('should work with callback refs', () => {
      const InputWithDefaults = withProps(Input, { defaultValue: 'test' });
      const refCallback = vi.fn();

      render(<InputWithDefaults ref={refCallback} />);
      expect(refCallback).toHaveBeenCalled();
      expect(refCallback.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('polymorphic components', () => {
    it('should render as default element type', () => {
      const Component = withProps(() => <div data-testid="test">Default</div>, {});
      render(<Component />);

      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    it('should support polymorphic "as" prop', () => {
      const Component = withProps(({ as: As = 'div', children, ...props }: any) => (
        <As {...props}>{children}</As>
      ), { className: 'default' });

      render(<Component as="button">Click me</Component>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('should maintain default props with polymorphic components', () => {
      const Component = withProps(({ as: As = 'div', children, ...props }: any) => (
        <As {...props}>{children}</As>
      ), { className: 'default-class' });

      render(<Component as="span">Content</Component>);
      const span = screen.getByText('Content');
      expect(span.tagName).toBe('SPAN');
      expect(span).toHaveClass('default-class');
    });
  });

  describe('chaining with withProps()', () => {
    it('should support chaining withProps() method', () => {
      const ButtonWithDefaults = withProps(Button, { className: 'base' });
      const ButtonWithMoreDefaults = ButtonWithDefaults.withProps({ type: 'submit' });

      render(<ButtonWithMoreDefaults>Submit</ButtonWithMoreDefaults>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('base');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should allow multiple levels of chaining', () => {
      const BaseButton = withProps(Button, { className: 'base' });
      const SubmitButton = BaseButton.withProps({ type: 'submit' });
      const DisabledSubmitButton = SubmitButton.withProps({ disabled: true });

      render(<DisabledSubmitButton>Submit</DisabledSubmitButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('base');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toBeDisabled();
    });

    it('should override props correctly in chained calls', () => {
      const BaseButton = withProps(Button, { className: 'base', type: 'button' });
      const SubmitButton = BaseButton.withProps({ className: 'submit', type: 'submit' });

      render(<SubmitButton>Submit</SubmitButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('submit');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('displayName', () => {
    it('should set displayName correctly', () => {
      const ButtonWithDefaults = withProps(Button, { className: 'default' });
      expect(ButtonWithDefaults.displayName).toBe('Button.withProps');
    });

    it('should set displayName for chained withProps', () => {
      const BaseButton = withProps(Button, { className: 'base' });
      const SubmitButton = BaseButton.withProps({ type: 'submit' });
      expect(SubmitButton.displayName).toBe('Button.withProps.withProps');
    });

    it('should handle components without displayName', () => {
      const AnonymousComponent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
      const ComponentWithDefaults = withProps(AnonymousComponent, { className: 'default' });
      expect(ComponentWithDefaults.displayName).toBe('Component.withProps');
    });
  });

  describe('event handlers', () => {
    it('should merge event handlers correctly', () => {
      const defaultOnClick = vi.fn();
      const customOnClick = vi.fn();

      const ButtonWithDefaults = withProps(Button, { onClick: defaultOnClick });
      render(<ButtonWithDefaults onClick={customOnClick}>Click me</ButtonWithDefaults>);

      const button = screen.getByRole('button');
      button.click();

      // Custom handler should be called, default should not (props override)
      expect(customOnClick).toHaveBeenCalledTimes(1);
      expect(defaultOnClick).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty default props', () => {
      const ButtonWithDefaults = withProps(Button, {});
      render(<ButtonWithDefaults className="test">Click</ButtonWithDefaults>);

      expect(screen.getByRole('button')).toHaveClass('test');
    });

    it('should handle undefined and null values in props', () => {
      const ButtonWithDefaults = withProps(Button, { className: undefined, 'data-test': null as any });
      render(<ButtonWithDefaults>Click</ButtonWithDefaults>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should work with complex prop values', () => {
      const style = { color: 'red', fontSize: '16px' };
      const ButtonWithDefaults = withProps(Button, { style });
      render(<ButtonWithDefaults>Click</ButtonWithDefaults>);

      const button = screen.getByRole('button');
      expect(button.style.color).toBe('red');
      expect(button.style.fontSize).toBe('16px');
    });

    it('should handle aria attributes', () => {
      const ButtonWithDefaults = withProps(Button, {
        'aria-label': 'Default button',
        role: 'button',
      });
      render(<ButtonWithDefaults aria-label="Custom button">Click</ButtonWithDefaults>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom button');
    });
  });
});
