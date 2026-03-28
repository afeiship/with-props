import React from 'react';
import withProps from '../src';

// Example 1: Using withProps with intrinsic element strings
const StyledDiv = withProps('div', {
  className: 'container',
  style: { padding: '16px' },
});

const PrimaryButton = withProps('button', {
  className: 'btn btn-primary',
  type: 'button' as const,
});

const Link = withProps('a', {
  target: '_blank',
  rel: 'noopener noreferrer',
});

// Example 2: Chaining with intrinsic elements
const BaseDiv = withProps('div', { className: 'base' });
const StyledContainer = BaseDiv.withProps({ style: { margin: 'auto' } });
const FinalContainer = StyledContainer.withProps({ id: 'final' });

// Example 3: Usage in components
function App() {
  return (
    <div>
      <StyledDiv id="my-div">
        This div has default className and style
      </StyledDiv>

      <PrimaryButton onClick={() => console.log('Clicked')}>
        Click me
      </PrimaryButton>

      <Link href="https://example.com">
        External Link
      </Link>

      <FinalContainer>
        Chained defaults: className='base', style, and id='final'
      </FinalContainer>
    </div>
  );
}

export default App;
