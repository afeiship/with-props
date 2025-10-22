import React from 'react';

type Override<T, U> = Omit<T, keyof U> & U;

export function withProps<P, T extends Partial<P>>(
  Component: React.ComponentType<P>,
  defaultProps: T
) {
  const WithPropsComponent = (props: Override<P, Partial<T>>) => {
    return <Component {...defaultProps} {...(props as P)} />;
  };

  // 可选：保留 displayName 便于调试
  WithPropsComponent.displayName = `withProps(${Component.displayName || Component.name})`;

  return WithPropsComponent as React.FC<Override<P, Partial<T>>>;
}
