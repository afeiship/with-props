import React, { type ElementType, forwardRef } from 'react';

/**
 * Base props interface for polymorphic components.
 * Includes the `as` prop to change the rendered element type and `children`.
 */
interface PolymorphicProps<C extends ElementType> {
  as?: C;
  children?: React.ReactNode;
}

/**
 * Core type utility: computes the complete Props type based on the component type C.
 * Logic: (custom base Props) & (C component's native Props - conflicting keys)
 */
type Props<C extends ElementType> = PolymorphicProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof PolymorphicProps<C>>;

/**
 * Type definition for the component returned by withProps (for external type inference).
 * All properties from defaultProps are made optional since they have default values.
 */
type WithPropsReturnType<D extends Record<string, unknown>> = (<C extends ElementType = 'div'>(
  props: D extends { as: infer DefaultAs extends ElementType }
    ? Props<DefaultAs> & Partial<Omit<D, 'as'>> & { as?: C; ref?: React.Ref<React.ComponentRef<C>> }
    : Props<C> & Partial<D> & { ref?: React.Ref<React.ComponentRef<C>> },
) => React.ReactElement) & {
  displayName?: string;
  withProps<D2 extends Record<string, unknown>>(
    this: WithPropsReturnType<D>,
    defaultProps: D2,
  ): WithPropsReturnType<D2>;
};

/**
 * A higher-order component that adds default props to a component.
 * Optimized for polymorphic components with `as` prop support.
 *
 * @param component - The component to wrap
 * @param defaultProps - Default props to merge with the component
 * @returns A new component with default props applied
 *
 * @example
 * ```tsx
 * const Button = withProps('button', { className: 'btn' });
 * const Link = Button.withProps({ as: 'a', href: '#' });
 * ```
 */
function withProps<D extends Record<string, unknown>>(component, defaultProps: D): WithPropsReturnType<D> {
  const Wrapped = forwardRef<HTMLElement, Props<'div'> & D>(function BoxWithProps(
    { as: asProp, children, ...props },
    ref,
  ) {
    // Prioritize the passed `as` prop, otherwise use the `as` from default props
    const Component = (asProp || (defaultProps.as as ElementType) || 'div') as ElementType;

    // Merge props: passed props override default props
    const mergedProps = {
      ...defaultProps,
      ...props,
      // Ensure `as` prop is handled correctly
      ...(asProp !== undefined && { as: asProp }),
    };

    return (
      <Component ref={ref} {...mergedProps}>
        {children}
      </Component>
    );
  });

  Wrapped.displayName = `${component.displayName || 'Box'}.withProps(${JSON.stringify(defaultProps)})`;

  // Recursively copy the withProps method to the new component for chaining
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
