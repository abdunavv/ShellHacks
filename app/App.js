import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Maximize, Minimize, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

import './App.css';

function Chatbot() {
  const [input, setInput] = useState('');
  const [userInputs, setUserInputs] = useState([]);
  const [aiResponses, setAiResponses] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Set up the PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [userInputs, aiResponses]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      setError(null);
      try {
        const extractedText = await extractTextFromPDF(file);
        if (extractedText.length > 0) {
          setInput(extractedText); // Set extracted text to input field
          setUserInputs((prev) => [...prev, extractedText]);
          simulateAiResponse(extractedText);
        } else {
          throw new Error('No text could be extracted from the PDF.');
        }
      } catch (err) {
        console.error('PDF processing error:', err);
        setError(`Failed to process the PDF: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const pdfData = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

      let text = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item) => item.str)
            .join(' ')
            .replace(/\s+/g, ' ');

          text += pageText + '\n\n'; // Add double line break between pages
        } catch (pageError) {
          console.error(`Error processing page ${pageNum}:`, pageError);
          text += `[Error processing page ${pageNum}]\n\n`;
        }
      }

      if (text.trim() === '') {
        throw new Error('No text could be extracted from the PDF.');
      }

      return text.trim();
    } catch (err) {
      console.error('Error extracting text from PDF:', err);
      throw new Error(`Failed to extract text from PDF: ${err.message}`);
    }
  };

  const simulateAiResponse = (userInput) => {
    setIsLoading(true);
    setTimeout(() => {
      const placeholderResponse = `Fix Thissssss: "${userInput}". and add the Model.`;
      setAiResponses((prev) => [...prev, placeholderResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setUserInputs((prev) => [...prev, input.trim()]);
      simulateAiResponse(input.trim());
      setInput('');
    }
  };

  return (
    <div className={`app-container ${isFullScreen ? 'fullscreen' : ''}`}>
      <div className={`chat-card ${isFullScreen ? 'fullscreen' : ''}`}>
        <div className="chat-header">
          <h2 className="chatbot-title">AI Chatbot</h2>
          <button onClick={toggleFullScreen} className="fullscreen-button">
            {isFullScreen ? <Minimize className="icon" /> : <Maximize className="icon" />}
          </button>
        </div>

        <div className="chat-body" ref={scrollAreaRef}>
          <AnimatePresence>
            {userInputs.map((userInput, index) => (
              <motion.div
                key={`conversation-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message user-message">
                  <span className="message-sender">You: </span>
                  {userInput}
                </div>
                {aiResponses[index] && (
                  <div className="message ai-message">
                    <span className="message-sender">AI: </span>
                    {aiResponses[index]}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isUploading && (
            <div className="status-message">Uploading and processing PDF...</div>
          )}
          {isLoading && (
            <div className="status-message">
              <Loader2 className="icon animate-spin" />
              AI is thinking...
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>

        <form onSubmit={handleFormSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
              ref={inputRef}
            />
            <span className="char-count">{input.length}/1000</span>
          </div>
          <button type="submit" className="send-button" disabled={isLoading || input.length === 0}>
            <Send className="icon" />
          </button>
          <label className="upload-button">
            <Upload className="icon" />
            <input type="file" accept=".pdf" onChange={handleFileUpload} className="file-input" />
          </label>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
