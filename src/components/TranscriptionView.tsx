import React, { useRef, useEffect } from "react";
import { TranscriptionSegment } from "../types";

export interface TranscriptionViewProps {
  transcriptions?: TranscriptionSegment[];
  className?: string;
  maxHeight?: string;
  maxWidth?: string;
}

export const TranscriptionView: React.FC<TranscriptionViewProps> = ({ 
  transcriptions = [],
  className = "",
  maxHeight = "200px",
  maxWidth = "512px"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // scroll to bottom when new transcription is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcriptions]);

  return (
    <div className={`relative mx-auto ${className}`} style={{ height: maxHeight, width: maxWidth, maxWidth: '90vw' }}>
      {/* Fade-out gradient mask */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent z-10 pointer-events-none" />

      {/* Scrollable content */}
      <div ref={containerRef} className="h-full flex flex-col gap-2 overflow-y-auto px-4 py-8">
        {transcriptions.map((segment) => (
          <div
            id={segment.id}
            key={segment.id}
            className={
              segment.role === "assistant"
                ? "p-2 self-start fit-content"
                : "bg-gray-800 rounded-md p-2 self-end fit-content"
            }
          >
            {segment.text}
          </div>
        ))}
      </div>
    </div>
  );
}; 