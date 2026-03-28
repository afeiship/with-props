import React, { forwardRef } from 'react';

/** Merges original props with default props, keeping optionality. */
type WithDefaultProps<T, D> = Omit<T, keyof D> & {
  [K in keyof D]?: K extends keyof T ? NonNullable<T[K]> | D[K] : D[K];
};

/** Extracts props type from a component. */
type ExtractProps<T> = T extends React.ComponentType<infer P> ? P : Record<string, unknown>;

/**
 * Return type for React components with withProps method.
 * This type allows chaining while preserving the original component's props.
 */
export type WithPropsReturnType<P, D extends Record<string, unknown>> = React.ForwardRefExoticComponent<WithDefaultProps<P, D> & { ref?: React.Ref<unknown> }> & {
  displayName?: string;
  withProps<D2 extends Record<string, unknown>>(
    this: WithPropsReturnType<P, any>,
    defaultProps: D2,
  ): WithPropsReturnType<P, D & D2>;
};

/**
 * Creates a new component with default props.
 * @param component - The original component
 * @param defaultProps - Default props to merge
 * @returns A new component with merged props and chainable withProps method
 */
function withProps<C extends React.ComponentType<any>, D extends Record<string, unknown>>(
  component: C,
  defaultProps: D,
): WithPropsReturnType<ExtractProps<C>, D> {
  const Wrapped = forwardRef<unknown, WithDefaultProps<ExtractProps<C>, D>>(function WrappedWithComponent(props, ref) {
    const mergedProps = { ...defaultProps, ...props };
    return React.createElement(component, { ref, ...mergedProps });
  });

  Wrapped.displayName = `${component.displayName || 'Component'}.withProps`;

  const result = Object.assign(Wrapped, {
    withProps<D2 extends Record<string, unknown>>(this: any, newDefaults: D2) {
      return withProps(this, newDefaults);
    },
  });

  return result as WithPropsReturnType<ExtractProps<C>, D>;
}

export default withProps;
