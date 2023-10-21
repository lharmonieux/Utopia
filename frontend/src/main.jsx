import ReactDOM from 'react-dom/client'
import '@fontsource/inter';
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import PreFetch from './PreFetch.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <PreFetch />
  </BrowserRouter>
)
