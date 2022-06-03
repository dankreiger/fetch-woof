import { useState } from 'react';
import { useFetch } from 'use-puppy-fetch';
import './App.css';
import logo from './logo.svg';

interface I_Todo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}
function App() {
  const { callFetch } = useFetch<I_Todo[], I_Todo[]>({
    url: 'https://jsonplaceholder.typicode.com/todos',
    transformResponse: (x) => x,
  });

  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={callFetch}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
