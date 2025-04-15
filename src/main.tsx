
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);
