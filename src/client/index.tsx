import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/index.css';

// Load HLS.js from CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
document.head.appendChild(script);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
