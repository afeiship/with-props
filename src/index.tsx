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
 */
export type Props<C extends ElementType> = PolymorphicProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof PolymorphicProps<C>>;

/**
 * Return type for components created with withProps.
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
 * @returns A new component with merged default props.
 * @example
 * ```tsx
 * const Box = withProps('div', { className: 'box' });
 * <Box as="section" className="custom" />
 * ```
 */
function withProps<D extends Record<string, unknown>>(component, defaultProps: D): WithPropsReturnType<D> {
  const Wrapped = forwardRef<HTMLElement, Props<'div'> & D>(function BoxWithProps(
    { as: asProp, children, ...props },
    ref,
  ) {
    // Use passed 'as' prop, or default to defaultProps.as, fallback to 'div'
    const Component = (asProp || (defaultProps.as as ElementType) || 'div') as ElementType;

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

  // Chain withProps method to the new component
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
