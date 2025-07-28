import React from 'react';
import { Room } from 'livekit-client';

export interface ConvaiClientProps {
  room?: Room;
  children?: React.ReactNode;
}

export const ConvaiClient: React.FC<ConvaiClientProps> = ({ room, children }) => {
  return (
    <div className="convai-client">
      {children}
    </div>
  );
}; 