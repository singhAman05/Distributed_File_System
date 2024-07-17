// src/components/QuoteCard.js
import React, { useState, useEffect } from "react";

const quotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "The best way to predict the future is to invent it.",
  "Simplicity is the soul of efficiency.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
];

const QuoteCard = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000); // Change quote every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background">
      <p className="text-lg italic text-gray-700 transition-opacity duration-500 fade-in">
        {quotes[currentQuote]}
      </p>
    </div>
  );
};

export default QuoteCard;
