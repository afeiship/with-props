import React, { ElementType, forwardRef } from 'react';

/**
 * Base props for polymorphic components.
 */
export interface PolymorphicProps<C extends ElementType> {
  as?: C;
  children?: React.ReactNode;
}

/**
 * Computes complete props type for a given component type.
 * Combines custom props with native component props, omitting conflicting keys.
 */
export type Props<C extends ElementType> = PolymorphicProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof PolymorphicProps<C>>;

/**
 * Return type for components created with withProps.
 * Supports polymorphic 'as' prop with proper type inference.
 */
export type WithPropsReturnType<D extends Record<string, unknown>> = (<C extends ElementType = 'div'>(
  props: D extends { as: infer DefaultAs }
    ? DefaultAs extends ElementType
      ? React.ComponentPropsWithoutRef<DefaultAs> & Omit<D, 'as'> & { as?: C; ref?: React.Ref<React.ComponentRef<C>> }
      : Props<C> & D & { ref?: React.Ref<React.ComponentRef<C>> }
    : Props<C> & D & { ref?: React.Ref<React.ComponentRef<C>> },
) => React.ReactElement) & {
  displayName?: string;
  withProps<D2 extends Record<string, unknown>>(
    this: WithPropsReturnType<D>,
    defaultProps: D2,
  ): WithPropsReturnType<D2>;
};

/**
 * Creates a polymorphic component with default props.
 * @param component - The component to wrap.
 * @param defaultProps - Default props to apply.
 * @returns A new component with merged default props and chained withProps method.
 * @example
 * ```tsx
 * const Box = withProps('div', { className: 'box' });
 * <Box as="button" className="custom" />
 * ```
 */
function withProps<D extends Record<string, unknown>>(component, defaultProps: D): WithPropsReturnType<D> {
  const Wrapped = forwardRef<HTMLElement, Props<'div'> & D>(function BoxWithProps(
    { as: asProp, children, ...props },
    ref,
  ) {
    // Use passed 'as' prop, or default to defaultProps.as, fallback to 'div'
    const Component = (asProp || (defaultProps.as as ElementType) || 'div') as ElementType;

    // Special handling for Fragment: only pass key and children
    // Check if component is Fragment (by comparing references)
    const isFragment = Component === React.Fragment ||
      (typeof Component === 'object' && Component !== null && '$$typeof' in Component &&
        (Component as any).$$typeof === Symbol.for('react.fragment'));

    if (isFragment) {
      return <Component {...(props as { key?: string })}>{children}</Component>;
    }

    // Merge props: passed props override default props
    const mergedProps = {
      ...defaultProps,
      ...props,
      // Ensure 'as' prop is handled correctly
      ...(asProp !== undefined && { as: asProp }),
    };

    return (
      <Component ref={ref} {...mergedProps}>
        {children}
      </Component>
    );
  });

  Wrapped.displayName = `${component.displayName || 'Box'}.withProps(${JSON.stringify(defaultProps)})`;

  // Chain withProps method to enable recursive composition
  return Object.assign(Wrapped as unknown as WithPropsReturnType<D>, {
    withProps<D2 extends Record<string, unknown>>(
      this: WithPropsReturnType<D>,
      defaultProps: D2,
    ): WithPropsReturnType<D2> {
      return withProps(this, defaultProps);
    },
  });
}

export default withProps;
