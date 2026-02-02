import React, { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  cursor?: boolean;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  speed = 50,
  onComplete,
  className = "",
  cursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    if (currentIndex >= text.length && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text.length, isComplete, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && !isComplete && <span className="typewriter-cursor">|</span>}
    </span>
  );
};

export default TypeWriter;
