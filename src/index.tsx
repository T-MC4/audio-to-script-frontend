import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MagicalGenerator from './features/MagicalGenerator';
import { Flow, TranscriptSource, flowQueryParam, transcriptSourceQueryParam } from './constants';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// This is a quick hack to avoid multiple branches
const App = () => {
  const params = new URLSearchParams(window.location.search);
  const flow = params.get(flowQueryParam) as Flow | null;
  const transcriptSource = params.get(transcriptSourceQueryParam) as TranscriptSource | null;

  if (
    !flow ||
    !transcriptSource ||
    !Object.values(Flow).includes(flow) ||
    !Object.values(TranscriptSource).includes(transcriptSource)
  ) {
    return null;
  } else {
    return (
      <MagicalGenerator transcriptSource={transcriptSource} flow={flow} />
    )
  }
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
