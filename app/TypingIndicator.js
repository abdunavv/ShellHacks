import React from 'react';
import { Box } from '@mui/material';

function TypingIndicator() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      color="text.secondary"
      pl={3}
    >
      <div className="typing-indicator">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <span style={{ marginLeft: '8px' }}>Assistant is typing...</span>
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dot {
          width: 6px;
          height: 6px;
          margin: 0 2px;
          background-color: #90caf9;
          border-radius: 50%;
          animation: typing 1s infinite ease-in-out;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </Box>
  );
}

export default TypingIndicator;
