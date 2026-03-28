# withProps String Elements Support

`withProps` 现在支持使用字符串形式的 HTML 元素，如 `'div'`, `'span'`, `'button'` 等。

## 基本用法

```tsx
import withProps from '@jswork/with-props';

// 使用字符串元素创建带默认 props 的组件
const StyledDiv = withProps('div', {
  className: 'container',
  style: { padding: '16px' },
});

// 使用
<StyledDiv id="my-div">
  这段 div 有默认的 className 和 style
</StyledDiv>
```

## 链式调用

```tsx
const BaseDiv = withProps('div', { className: 'base' });
const StyledDiv = BaseDiv.withProps({ style: { margin: 'auto' } });
const FinalDiv = StyledDiv.withProps({ id: 'final' });

<FinalDiv>具有累积的默认 props</FinalDiv>
```

## 常见用例

### 按钮组件

```tsx
const PrimaryButton = withProps('button', {
  className: 'btn btn-primary',
  type: 'button',
});

<PrimaryButton onClick={handleClick}>点击我</PrimaryButton>
```

### 链接组件

```tsx
const ExternalLink = withProps('a', {
  target: '_blank',
  rel: 'noopener noreferrer',
});

<ExternalLink href="https://example.com">
  外部链接
</ExternalLink>
```

### 表单元素

```tsx
const DefaultInput = withProps('input', {
  type: 'text',
  className: 'form-control',
});

<DefaultInput placeholder="请输入..." />
```

## 类型支持

`withProps` 完全支持 TypeScript 类型推断：

```tsx
const StyledDiv = withProps('div', { className: 'styled' });

// 类型：React.ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }>
// 并且支持链式调用
```

## displayName

使用字符串元素时，`displayName` 将会是元素名称：

```tsx
const StyledDiv = withProps('div', { className: 'styled' });
console.log(StyledDiv.displayName); // "div.withProps"

const StyledDiv2 = StyledDiv.withProps({ id: 'test' });
console.log(StyledDiv2.displayName); // "div.withProps.withProps"
```

## ref 转发

字符串元素也支持 ref 转发：

```tsx
const StyledDiv = withProps('div', { className: 'styled' });

const ref = useRef<HTMLDivElement>(null);

<StyledDiv ref={ref}>内容</StyledDiv>
```
