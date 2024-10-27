"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getBookAnalysis } from "../../lib/api";
import { BookOpen, ChevronRight, Loader2 } from "lucide-react";

interface AnalysisModalProps {
  isOpen: boolean;
  bookId: string;
  onClose: () => void;
}

interface AnalysisSection {
  title: string;
  content: string;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  bookId,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<AnalysisSection[]>([]);

  // Helper function to parse analysis into sections
  const parseAnalysisIntoSections = (text: string) => {
    // Split by common section indicators like "Theme:", "Characters:", etc.
    const rawSections = text.split(/(?=\b(?:Theme|Plot|Characters|Setting|Style|Summary|Analysis|Symbolism|Conclusion)s?:)/i);
    
    return rawSections
      .filter(section => section.trim())
      .map(section => {
        const [title, ...content] = section.split(':');
        return {
          title: title.trim(),
          content: content.join(':').trim()
        };
      });
  };

  const typeAnalysis = useCallback((text: string) => {
    const parsedSections = parseAnalysisIntoSections(text);
    let currentSectionIndex = 0;
    let currentWordIndex = 0;
    
    setSections(parsedSections.map(section => ({ 
      title: section.title, 
      content: '' 
    })));

    const typeNextWord = () => {
      if (currentSectionIndex >= parsedSections.length) return;
      
      const currentSection = parsedSections[currentSectionIndex];
      const words = currentSection.content.split(' ');
      
      if (currentWordIndex < words.length) {
        setSections(prev => {
          const newSections = [...prev];
          newSections[currentSectionIndex].content += 
            (newSections[currentSectionIndex].content.length ? ' ' : '') + 
            words[currentWordIndex];
          return newSections;
        });
        currentWordIndex++;
      } else {
        currentSectionIndex++;
        currentWordIndex = 0;
      }

      if (currentSectionIndex < parsedSections.length) {
        setTimeout(typeNextWord, 50);
      }
    };

    typeNextWord();
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const result = await getBookAnalysis(bookId);
        typeAnalysis(result);
      } catch (error) {
        setSections([{ 
          title: "Error", 
          content: "Failed to fetch analysis." 
        }]);
        console.error("Error fetching book analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchAnalysis();
  }, [isOpen, bookId, typeAnalysis]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-11/12 max-w-3xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Literary Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div className="h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="p-6">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Analyzing the text...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg bg-gray-50 p-4 shadow-sm transition-all duration-200 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                    <div className="my-2 h-px bg-gray-200" />
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;