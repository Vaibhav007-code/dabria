import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
  onClose,
  selectedFont,
  setSelectedFont,
  textColor,
  setTextColor,
}) => {
  const fonts = [
    { name: 'Serif', value: 'font-serif' },
    { name: 'Sans', value: 'font-sans' },
    { name: 'Mono', value: 'font-mono' },
  ];

  const colors = [
    { name: 'Blood Red', value: 'text-red-600' },
    { name: 'Crimson', value: 'text-red-700' },
    { name: 'Dark Red', value: 'text-red-800' },
    { name: 'Purple', value: 'text-purple-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-16 right-4 w-64 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl p-4 z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Settings</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-red-900/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Font Style</label>
          <div className="space-y-2">
            {fonts.map((font) => (
              <button
                key={font.value}
                onClick={() => setSelectedFont(font.value)}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedFont === font.value
                    ? 'bg-red-900/40'
                    : 'hover:bg-red-900/20'
                } transition-colors`}
              >
                <span className={font.value}>{font.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Text Color</label>
          <div className="space-y-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setTextColor(color.value)}
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                  textColor === color.value
                    ? 'bg-red-900/40'
                    : 'hover:bg-red-900/20'
                } transition-colors`}
              >
                <span className={`w-4 h-4 rounded-full ${color.value} bg-current`} />
                <span>{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;