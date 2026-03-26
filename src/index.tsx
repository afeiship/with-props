import React from 'react';

type PropsWithDefaults<P, D extends Partial<P>> = Omit<P, keyof D> & Partial<D>;

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
