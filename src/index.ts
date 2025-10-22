import { createElement, ComponentType } from 'react';

function withProps<P>(
  Component: ComponentType<P>,
  defaultProps?: Partial<P>
): ComponentType<P> | ((Component: ComponentType<P>) => ComponentType<P>) {
  const enhance = (Component: ComponentType<P>): ComponentType<P> => {
    return (props: P) => {
      // 合并 props
      const mergedProps = { ...defaultProps, ...props } as any;
      // 返回创建的元素
      return createElement(Component as any, mergedProps);
    };
  };

  // 如果传入了 Component，则直接返回增强组件
  return Component ? enhance(Component) : enhance;
}

export default withProps;
