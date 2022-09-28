import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const url = window.location.host

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App url={url}/>
  </React.StrictMode>
)
