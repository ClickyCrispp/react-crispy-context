To use this package, import the `createReactCrispyContext` function and use it to create a new context object. You can then pass the initial state for your application as an argument to this function.

```
import { createReactCrispyContext } from 'react-crispy-context';

const initialState = {
  count: 0,
};

const { Provider, useStore, useStoreState, useStoreUpdater } = createReactCrispyContext(initialState);
```

Once you have created your context object, you can use the `Provider` component to wrap your React app. This will make the global state available to any components within the app.

```
function App() {
  return (
    <Provider>
      <Content />
    </Provider>
  );
}
```

To access the global state within a component, use the useStore hook. This hook takes a selector argument that specifies the path to the piece of state you want to access. The hook returns an array containing the current value of the specified state and a function for updating it.
```
function Content() {
  const [count, setCount] = useStore('count');

  return (
    <div>
      <p>The current count is {count}.</p>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
    </div>
  );
}

// or you could do this to isolate the stateUpdate hook, from the state value hook 
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


This package also allows you to use dot notation to specify the path to the piece of state you want to access. With full typescript support. Just make sure your key has a default value before you try to access/update it (avoid using Partial on the Store type)

```
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

Dot notation works for all of the hooks that subscribe to state





License: MIT