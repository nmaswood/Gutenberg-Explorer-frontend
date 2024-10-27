// components/AnalysisModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getBookAnalysis } from "../../../lib/api";

interface AnalysisModalProps {
  isOpen: boolean;
  bookId: string;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  bookId,
  onClose,
}) => {
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const typeAnalysis = (text: string) => {
    const words = text.split(" ");
    let index = 0;
    setAnalysis([]);

    const typingInterval = setInterval(() => {
      if (index < words.length) {
        setAnalysis((prev) => [...prev, words[index]]);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const result = await getBookAnalysis(bookId);
        typeAnalysis(result.analysis);
      } catch (error) {
        setAnalysis(["Failed to fetch analysis."]);
        console.error("Error fetching book analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchAnalysis();
  }, [isOpen, bookId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div
        className="relative w-3/4 max-w-lg overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300"
        style={{ maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Book Analysis</h2>
          <div
            className="min-h-[150px] max-h-[60vh] overflow-y-auto rounded bg-gray-50 p-4 font-mono text-sm text-gray-700"
            style={{ scrollbarWidth: "thin" }}
          >
            {loading ? (
              "Analyzing..."
            ) : (
              <p>{analysis.join(" ")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
