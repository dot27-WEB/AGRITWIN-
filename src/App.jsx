import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { FarmProvider } from './context/FarmContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';
import Copilot from './components/copilot/Copilot';
import './styles/globals.css';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <FarmProvider>
          <div className="flex flex-col min-h-screen relative bg-[#040814]">
            
            {/* Navigation Header */}
            <Navbar />
            
            {/* Primary Main Content Viewport */}
            <main className="flex-grow">
              <AppRoutes />
            </main>
            
            {/* Brand Footer */}
            <Footer />
            <Copilot />
            
          </div>
        </FarmProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
