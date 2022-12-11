# React Crispy Context

<div align="center">
[![npm downloads](https://img.shields.io/npm/dm/react-crispy-context.svg?style=for-the-badge)](https://www.npmjs.com/package/react-crispy-context)
[![npm](https://img.shields.io/npm/dt/react-crispy-context.svg?style=for-the-badge)](https://www.npmjs.com/package/react-crispy-context)
[![npm](https://img.shields.io/npm/l/react-crispy-context?style=for-the-badge)](https://www.npmjs.com/package/react-crispy-context)
</div>

I created this libary to fix some issues with Reacts Context api, this solution effectively adds selectors to the state, so you can subscribe to individual slices of a larger state object.

Best Practices: 
* Best used with Typescript, the dot notation, it was built with that in mind.
* If you are setting an object/array to overwrite the existing data you should pass in a newly created object/array, since we use mutation. I may try to find a way to enforce/improve this somehow in future versions.
* This package is meant to improve the uses of the react context api, and not replace useState/useReducer.
* Do not use a partial type
* Define your initial value, with your object shape, so accessing nested fields works as expected

### Features

- Built with performance, UX and DX in mind
- Uses the pub/sub pattern
- Uses dot notation to efficiently subsribe to any level of depth of your state

### Install

    npm install react-crispy-context

### Quickstart

```tsx
import { createReactCrispyContext } from 'react-crispy-context';

const initialState = {
  count: 0,
};

const { Provider, useStore, useStoreState, useStoreUpdater } = createReactCrispyContext(initialState);

function App() {
  return (
    <Provider>
      <Content />
    </Provider>
  );
}

function Content() {
  const [count, setCount] = useStore('count');

  return (
    <div>
      <p>The current count is {count}.</p>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
    </div>
  );
}

function Content() {
  const count = useStoreState('count');
  const setCount = useStoreUpdater('count');

  return (
    <div>
      <p>The current count is {count}.</p>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
    </div>
  );
}
```
<div align="center">



</div>

This package also allows you to use dot notation to specify the path to the piece of state you want to access. With full typescript support. Just make sure your key has a default value before you try to access/update it (avoid using Partial on the Store type)

```tsx
const initialState = {
  user: {
    name: 'John Doe',
    email: 'johndoe@example.com',
    preferences: {
      darkMode: true,
    },
  },
};

// you could access that state like this
const darkMode = useStoreState('user.preferences.darkMode');
```

Dot notation works for all of the hooks that read or update state
