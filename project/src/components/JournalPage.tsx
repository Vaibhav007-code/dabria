import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, HardDrive } from 'lucide-react';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface JournalPageProps {
  pageNumber: number;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  font: string;
  textColor: string;
  darkMode: boolean;
  userId: string;
}

const MAX_STORAGE = 512 * 1024 * 1024; // 512MB in bytes

const JournalPage: React.FC<JournalPageProps> = ({
  pageNumber,
  isActive,
  onNext,
  onPrev,
  font,
  textColor,
  darkMode,
  userId
}) => {
  const [content, setContent] = useState('');
  const [usedSpace, setUsedSpace] = useState(0);

  // Use Dexie's live query to reactively fetch the entry
  const entry = useLiveQuery(
    async () => {
      try {
        return await db.entries
          .where('userIdAndPage')
          .equals(`${userId}-${pageNumber}`)
          .first();
      } catch (error) {
        console.error('Error fetching entry:', error);
        return null;
      }
    },
    [userId, pageNumber]
  );

  // Load content when entry changes
  useEffect(() => {
    if (entry) {
      setContent(entry.content);
    } else {
      setContent('');
    }
  }, [entry]);

  // Calculate total used space
  const totalSize = useLiveQuery(
    async () => {
      try {
        const entries = await db.entries
          .where('userId')
          .equals(userId)
          .toArray();
        return entries.reduce((acc, entry) => acc + entry.size, 0);
      } catch (error) {
        console.error('Error calculating total size:', error);
        return 0;
      }
    },
    [userId]
  ) ?? 0;

  useEffect(() => {
    setUsedSpace(totalSize);
  }, [totalSize]);

  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const contentSize = new Blob([newContent]).size;
    
    if (totalSize - (entry?.size ?? 0) + contentSize <= MAX_STORAGE) {
      setContent(newContent);
      
      try {
        await db.entries.put({
          id: entry?.id,
          userId,
          content: newContent,
          pageNumber,
          size: contentSize,
          createdAt: new Date()
        });
      } catch (error) {
        console.error('Error saving entry:', error);
      }
    } else {
      console.warn('Storage limit reached');
    }
  };

  const usedPercentage = (usedSpace / MAX_STORAGE) * 100;

  return (
    <div
      className={`w-full h-full rounded-lg shadow-2xl p-8 relative transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-900 bg-opacity-95' 
          : 'bg-red-50 bg-opacity-90'
      }`}
    >
      <div className={`absolute inset-0 rounded-lg ${
        darkMode 
          ? 'bg-gradient-to-b from-transparent to-black/40' 
          : 'bg-gradient-to-b from-transparent to-red-100/40'
      }`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onPrev}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'bg-red-900/20 hover:bg-red-900/40' 
                : 'bg-red-200 hover:bg-red-300'
            }`}
            disabled={pageNumber === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className={`${font} text-lg opacity-75`}>Page {pageNumber}</span>
          <button
            onClick={onNext}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'bg-red-900/20 hover:bg-red-900/40' 
                : 'bg-red-200 hover:bg-red-300'
            }`}
            disabled={pageNumber === 3}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <textarea
          className={`w-full h-[calc(100vh-300px)] bg-transparent ${font} ${textColor} 
            resize-none focus:outline-none focus:ring-0 border-0 
            leading-relaxed placeholder-red-400/50`}
          placeholder="Pour your darkest thoughts onto these pages..."
          value={content}
          onChange={handleContentChange}
          style={{
            backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, ${
              darkMode ? 'rgba(139, 0, 0, 0.2)' : 'rgba(220, 38, 38, 0.1)'
            } 31px, ${
              darkMode ? 'rgba(139, 0, 0, 0.2)' : 'rgba(220, 38, 38, 0.1)'
            } 32px)`,
            lineHeight: '32px',
            padding: '8px 0',
          }}
        />
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4" />
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${usedPercentage}%` }}
            />
          </div>
          <span className="text-xs opacity-75">
            {Math.round(usedPercentage)}%
          </span>
        </div>
        <motion.div
          className="text-sm opacity-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
        >
          {new Date().toLocaleDateString()}
        </motion.div>
      </div>
    </div>
  );
};

export default JournalPage;