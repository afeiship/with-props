/// <reference types="bun" />
import { test, expect } from 'bun:test';
import React from 'react';
import withProps from '../src';

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
