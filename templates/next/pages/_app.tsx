import React from 'react';
import './_app.css';

export function reportWebVitals(metric) {
  // These metrics can be sent to any analytics service
  console.log(metric)
}

const App = ({ pageProps, Component }) => (
  <Component {...pageProps} />
)

export default App;
