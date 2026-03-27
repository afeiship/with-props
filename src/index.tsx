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
 * Helper type to check if a type is a string literal element type
 */
type IsStringElementType<T> = T extends string ? true : false;

/**
 * Implementation for string elements only (not React components)
 */
function withProps<C extends keyof JSX.IntrinsicElements, D extends Record<string, unknown>>(
  component: C,
  defaultProps: D,
): (<C2 extends ElementType = C>(
  props: D extends { as: infer DefaultAs extends ElementType }
    ? Props<DefaultAs> & Partial<Omit<D, 'as'>> & { as?: C2; ref?: React.Ref<React.ComponentRef<C2>> }
    : Props<C2> & Partial<D> & { ref?: React.Ref<React.ComponentRef<C2>> },
) => React.ReactElement) & {
  displayName?: string;
  withProps<D2 extends Record<string, unknown>>(defaultProps: D2): any;
};

/**
 * Implementation for React components
 */
function withProps<P extends Record<string, unknown>, D extends Partial<P>>(
  component: React.ComponentType<P>,
  defaultProps: D,
): React.FC<Omit<P, keyof D> & Partial<D> & React.HTMLAttributes<HTMLElement>> & {
  displayName?: string;
  withProps<D2 extends Partial<any>>(defaultProps: D2): any;
};

/**
 * Main implementation
 */
function withProps(component: any, defaultProps: any): any {
  const isStringElement = typeof component === 'string';

  if (!isStringElement) {
    // For React components, wrap directly preserving their props
    const Wrapped: React.FC<any> = function(props) {
      const mergedProps = {
        ...defaultProps,
        ...props,
      };

      return React.createElement(component, mergedProps);
    };

    const componentName = component.displayName || component.name || 'Component';
    Wrapped.displayName = `${componentName}.withProps(${JSON.stringify(defaultProps)})`;

    return Object.assign(Wrapped, {
      withProps(this: any, newDefaults: any): any {
        return withProps(this, newDefaults);
      },
    });
  }

  // For string elements, use polymorphic wrapper
  const Wrapped = forwardRef<HTMLElement, Props<'div'> & any>(function BoxWithProps(
    { as: asProp, children, ...props },
    ref,
  ) {
    const Component = (asProp || (defaultProps.as as ElementType) || component || 'div') as ElementType;

    const mergedProps = {
      ...defaultProps,
      ...props,
      ...(asProp !== undefined && { as: asProp }),
    };

    return (
      <Component ref={ref} {...mergedProps}>
        {children}
      </Component>
    );
  });

  Wrapped.displayName = `Box.withProps(${JSON.stringify(defaultProps)})`;

  return Object.assign(Wrapped, {
    withProps(this: any, newDefaults: any): any {
      return withProps(this, newDefaults);
    },
  });
}

export default withProps;
