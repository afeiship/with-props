import React, { ElementType, forwardRef } from 'react';

/** Base props for polymorphic components with `as` prop. */
export interface PolymorphicProps<C extends ElementType> {
  as?: C;
  children?: React.ReactNode;
}

/** Calculates complete props for a polymorphic component of type C. */
export type Props<C extends ElementType> = PolymorphicProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof PolymorphicProps<C>>;

/** Return type for polymorphic components with withProps method. */
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

/** Merges original props with default props, keeping optionality. */
type WithDefaultProps<T, D> = Omit<T, keyof D> & {
  [K in keyof D]?: K extends keyof T ? NonNullable<T[K]> | D[K] : D[K];
};

/** Extracts props type from a component. */
type ExtractProps<T> =
  T extends React.ComponentType<infer P>
    ? P
    : T extends React.JSXElementConstructor<infer P>
      ? P
      : Record<string, unknown>;

/**
 * Creates a new component with default props.
 * @param component - The original component
 * @param defaultProps - Default props to merge
 * @returns A new component with merged props
 */
function withProps<C extends React.ComponentType<any> & { withProps?: never }, D extends Record<string, unknown>>(
  component: C,
  defaultProps: D,
): React.ComponentType<WithDefaultProps<ExtractProps<C>, D>>;

/** Polymorphic component overload. */
function withProps<D extends Record<string, unknown>>(component: any, defaultProps: D): WithPropsReturnType<D>;

/** Implementation. */
function withProps(component: any, defaultProps: any): any {
  const Wrapped = forwardRef(function WrappedWithComponent(props: any, ref: any) {
    const mergedProps = { ...defaultProps, ...props };
    return React.createElement(component, { ref, ...mergedProps });
  });

  Wrapped.displayName = `${component.displayName || 'Component'}.withProps`;

  return Object.assign(Wrapped, {
    withProps<D2 extends Record<string, unknown>>(this: any, newDefaults: D2) {
      return withProps(this, newDefaults);
    },
  });
}

export default withProps;
