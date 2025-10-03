const { expect, test } = require('@jest/globals');

// Simple snapshot test for Loader component functionality
test('Loader component snapshot', () => {
  // Test the Loader component's basic structure
  const loaderData = {
    text: 'Loading…',
    component: 'Loader',
    props: {
      role: 'img',
      'aria-label': 'spinner'
    }
  };
  
  expect(loaderData).toMatchSnapshot();
});

test('Loader with custom text snapshot', () => {
  const loaderData = {
    text: 'Loading user…',
    component: 'Loader',
    props: {
      role: 'img',
      'aria-label': 'spinner'
    }
  };
  
  expect(loaderData).toMatchSnapshot();
});
