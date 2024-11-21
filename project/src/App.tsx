import React, { useState } from 'react';
import { Moon, Sun, Share2, Type, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JournalPage from './components/JournalPage';
import Header from './components/Header';
import Settings from './components/Settings';
import Auth from './components/Auth';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFont, setSelectedFont] = useState('font-serif');
  const [textColor, setTextColor] = useState('text-red-600');
  const [userId, setUserId] = useState<string | null>(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (!userId) {
    return <Auth onLogin={setUserId} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-black text-red-500' : 'bg-red-50 text-red-900'
    }`}>
      <Header />
      
      <div className="fixed top-4 right-4 flex gap-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-full transition-colors ${
            darkMode 
              ? 'bg-red-900/20 hover:bg-red-900/40' 
              : 'bg-red-200 hover:bg-red-300'
          }`}
        >
          <Type className="w-5 h-5" />
        </button>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors ${
            darkMode 
              ? 'bg-red-900/20 hover:bg-red-900/40' 
              : 'bg-red-200 hover:bg-red-300'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          className={`p-2 rounded-full transition-colors ${
            darkMode 
              ? 'bg-red-900/20 hover:bg-red-900/40' 
              : 'bg-red-200 hover:bg-red-300'
          }`}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showSettings && (
          <Settings
            onClose={() => setShowSettings(false)}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            textColor={textColor}
            setTextColor={setTextColor}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <div className="relative perspective-1000">
          <div className="book-container relative w-full max-w-4xl mx-auto aspect-[3/2] transform-style-preserve-3d">
            {[0, 1, 2].map((pageNum) => (
              <motion.div
                key={pageNum}
                initial={false}
                animate={{
                  rotateY: currentPage === pageNum ? 0 : -180,
                  zIndex: currentPage === pageNum ? 10 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                }}
              >
                <JournalPage
                  pageNumber={pageNum + 1}
                  isActive={currentPage === pageNum}
                  onNext={() => setCurrentPage(Math.min(2, pageNum + 1))}
                  onPrev={() => setCurrentPage(Math.max(0, pageNum - 1))}
                  font={selectedFont}
                  textColor={textColor}
                  darkMode={darkMode}
                  userId={userId}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;