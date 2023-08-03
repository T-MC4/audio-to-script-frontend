import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AudioToScript from './features/AudioToScript';
import ScriptToFormattedScript from './features/ScriptToFormattedScript';

enum AppType {
  audioToScript = 'audio-recording-to-script',
  scriptToFormattedScript = 'script-to-formatted-script'
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// This is a quick hack to avoid multiple branches
const App = () => {
  if (process.env.NODE_ENV === 'development') return <div className='flex'>
    <AudioToScript />
    <ScriptToFormattedScript />
  </div>

  if (process.env.REACT_APP_APP_TYPE === AppType.audioToScript) return <AudioToScript />
  else if (process.env.REACT_APP_APP_TYPE === AppType.scriptToFormattedScript) return <ScriptToFormattedScript />

  return null;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
