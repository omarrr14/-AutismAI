import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Results from './pages/Results';
import About from './pages/About';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ThemeProvider>
      <Router>
        <div className={`relative min-h-screen flex flex-col ${i18n.language === 'ar' ? 'font-arabic' : ''}`}>
          <AnimatedBackground />
          
          <div className="relative z-10 flex flex-col flex-grow">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/predict" element={<Predict />} />
                <Route path="/results" element={<Results />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
