import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Ensure your index.css is correctly imported
import App from './App';  // Ensure App.js is correctly imported

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Make sure this matches 'root' in index.html
);
