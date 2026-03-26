import React from 'react';

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
 * has a displayName in the format `withProps(ComponentName)`.
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
 * // With function components
 * const Card = withProps(({ title, subtitle = 'No subtitle' }: {
 *   title: string;
 *   subtitle?: string;
 * }) => (
 *   <div>
 *     <h2>{title}</h2>
 *     <p>{subtitle}</p>
 *   </div>
 * ), { subtitle: 'Default subtitle' });
 * ```
 *
 * @remarks
 * - The HOC preserves the original component's behavior and only adds default prop values.
 * - Explicit props passed to the wrapped component always override defaults.
 * - The displayName is set for better debugging in React DevTools.
 */
const withProps = <P, D extends Partial<P>>(
  Component: React.ComponentType<P>,
  defaultProps: D,
): React.ComponentType<PropsWithDefaults<P, D>> => {
  const Wrapped = (props: PropsWithDefaults<P, D>) => {
    const ComponentForRender = Component as (props: P) => React.ReactElement | null;
    const mergedProps = { ...defaultProps, ...props };
    return ComponentForRender(mergedProps as P);
  };

  Wrapped.displayName = `withProps(${Component.displayName || 'Component'})`;

  return Wrapped;
};

export default withProps;
