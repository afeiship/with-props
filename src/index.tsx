import React, { forwardRef, type JSX } from 'react';

/** Extract the ref type from props. */
type RefType<T> = T extends { ref?: infer R } ? R : unknown;

/** Merges original props with default props, keeping optionality and original types. */
type WithDefaultProps<T, D> = Omit<T, keyof D> & Partial<Pick<T, Extract<keyof D, keyof T>>>;

/** Extracts props type from a component or intrinsic element string. */
type ExtractProps<T> = T extends React.ComponentType<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : Record<string, unknown>;

/**
 * Return type for React components with withProps method.
 * This type allows chaining while preserving the original component's props.
 */
export type WithPropsReturnType<P, D extends Record<string, unknown>> =
  React.ForwardRefExoticComponent<WithDefaultProps<P, D> & { ref?: RefType<P> }>
  & {
  displayName?: string;
  withProps<D2 extends Record<string, unknown>>(
    this: WithPropsReturnType<P, any>,
    defaultProps: D2,
  ): WithPropsReturnType<P, D & D2>;
};

/**
 * Creates a new component with default props.
 * @param component - The original component or intrinsic element string (e.g., 'div', 'span')
 * @param defaultProps - Default props to merge
 * @returns A new component with merged props and chainable withProps method
 *
 * @example
 * // With a component
 * const DefaultCard = withProps(Card, { variant: 'elevated' });
 *
 * // With an intrinsic element
 * const StyledDiv = withProps('div', { className: 'styled' });
 */
function withProps<C extends React.ComponentType<any> | keyof JSX.IntrinsicElements, D extends Record<string, unknown>>(
  component: C,
  defaultProps: D,
): WithPropsReturnType<ExtractProps<C>, D> {
  type Props = ExtractProps<C>;
  type RefType = Props extends { ref?: infer R } ? R : unknown;

  const Wrapped = forwardRef<RefType, WithDefaultProps<Props, D>>(
    function WrappedWithComponent(props, ref) {
      const mergedProps = { ...defaultProps, ...props };
      return React.createElement(component as any, { ref, ...mergedProps });
    },
  );

  const displayName = typeof component === 'string'
    ? component
    : (component as any).displayName || (component as any).name || 'Component';
  Wrapped.displayName = `${displayName}.withProps`;

  const result = Object.assign(Wrapped, {
    withProps<D2 extends Record<string, unknown>>(this: any, newDefaults: D2) {
      return withProps(this, newDefaults);
    },
  });

  return result as WithPropsReturnType<Props, D>;
}

export default withProps;
