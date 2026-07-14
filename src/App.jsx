import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { FarmProvider } from './context/FarmContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import VoiceAssistant from './components/voiceAssistant/VoiceAssistant';
import AppRoutes from './routes/AppRoutes';
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
            
            {/* Floating Audio AI Assistant */}
            <VoiceAssistant />

          </div>
        </FarmProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
