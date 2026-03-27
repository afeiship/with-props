import React, { forwardRef } from 'react';

/**
 * A type that represents props with default values applied.
 *
 * This type constructs a new props type where properties specified in the defaults
 * become optional, while all other props remain required.
 *
 * @template P - The original props type of the component
 * @template D - The type of default props (must be a partial of P)
 *
 * @example
 * ```tsx
 * interface ButtonProps {
 *   label: string;
 *   size: 'small' | 'medium' | 'large';
 *   disabled: boolean;
 * }
 *
 * // With defaults for 'size' and 'disabled'
 * type ButtonPropsWithDefaults = PropsWithDefaults<ButtonProps, { size: 'medium'; disabled: false }>;
 * // Result: { label: string; size?: 'medium'; disabled?: false }
 * ```
 */
type PropsWithDefaults<P, D extends Partial<P>> = Omit<P, keyof D> & Partial<D>;

/**
 * The return type of withProps, supporting chaining.
 */
type WithPropsComponent<P, D extends Partial<P>> = React.ForwardRefExoticComponent<
  PropsWithDefaults<P, D> & React.RefAttributes<unknown>
> & {
  displayName?: string;
  withProps<D2 extends Partial<P>>(
    this: WithPropsComponent<P, D>,
    defaultProps: D2,
  ): WithPropsComponent<P, D2>;
};

/**
 * A higher-order component that applies default props to a React component.
 *
 * This function creates a new component with specified default props. When the wrapped
 * component is used, the provided props are merged with the defaults, where explicit
 * props take precedence over defaults.
 *
 * @template P - The props type of the original component
 * @template D - The type of default props (must extend Partial<P>)
 *
 * @param Component - The React component to wrap. Can be a function component or class component.
 * @param defaultProps - An object containing default values for specific props.
 * These props become optional when using the wrapped component.
 *
 * @returns A new React component with the default props applied. The returned component
 * has a displayName in the format `withProps(ComponentName)` and supports chaining.
 *
 * @example
 * ```tsx
 * interface ButtonProps {
 *   label: string;
 *   variant: 'primary' | 'secondary';
 *   size: 'sm' | 'md' | 'lg';
 * }
 *
 * const Button = ({ label, variant, size }: ButtonProps) => (
 *   <button className={`${variant} ${size}`}>{label}</button>
 * );
 *
 * const DefaultButton = withProps(Button, {
 *   variant: 'primary',
 *   size: 'md',
 * });
 *
 * // 'variant' and 'size' are now optional
 * <DefaultButton label="Click me" />
 * <DefaultButton label="Click me" variant="secondary" />
 * ```
 *
 * @example
 * ```tsx
 * // Chaining withProps
 * const PrimaryButton = withProps(Button, { variant: 'primary' });
 * const SmallPrimaryButton = PrimaryButton.withProps({ size: 'sm' });
 *
 * // <SmallPrimaryButton label="Click" /> has variant='primary' and size='sm'
 * ```
 *
 * @remarks
 * - The HOC preserves the original component's behavior and only adds default prop values.
 * - Explicit props passed to the wrapped component always override defaults.
 * - The displayName is set for better debugging in React DevTools.
 * - Supports forwarding refs.
 * - Supports chaining via the `.withProps()` method.
 */
function withProps<P extends object, D extends Partial<P>>(
  Component: React.ComponentType<P>,
  defaultProps: D,
): WithPropsComponent<P, D> {
  const Wrapped = forwardRef<unknown, PropsWithDefaults<P, D>>(function WithProps(
    props,
    ref,
  ) {
    const mergedProps = {
      ...defaultProps,
      ...props,
    } as unknown as P;

    return React.createElement(Component, mergedProps);
  });

  Wrapped.displayName = `withProps(${Component.displayName || Component.name || 'Component'})`;

  // Support chaining
  return Object.assign(Wrapped as unknown as WithPropsComponent<P, D>, {
    withProps<D2 extends Partial<P>>(
      this: WithPropsComponent<P, D>,
      additionalDefaults: D2,
    ): WithPropsComponent<P, D2> {
      // Merge the existing defaults with new defaults
      const mergedDefaults = {
        ...defaultProps,
        ...additionalDefaults,
      } as unknown as D & D2;

      return withProps(Component, mergedDefaults) as unknown as WithPropsComponent<P, D2>;
    },
  });
}

export default withProps;
