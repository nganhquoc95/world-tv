import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
import './styles/index.css';

// Load HLS.js from CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
document.head.appendChild(script);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

function renderApp() {
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    );
}

renderApp();

// Enable Hot Module Replacement (HMR) in development
if (import.meta.hot) {
    import.meta.hot.accept('./components/App', (newApp) => {
        if (newApp) {
            renderApp();
        }
    });
}
