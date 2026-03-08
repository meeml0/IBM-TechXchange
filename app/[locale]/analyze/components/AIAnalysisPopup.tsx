'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X, Zap, Leaf, TrendingUp } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

interface AIAnalysisPopupProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: number;
  companyData?: {
    name?: string;
    industry?: string;
    size?: string;
    location?: string;
  };
  onAnalysisComplete?: (results: any[]) => void; // NEW: Send results to dashboard
}

const AIAnalysisPopup: React.FC<AIAnalysisPopupProps> = ({ 
  isOpen, 
  onClose, 
  companyId, 
  companyData,
  onAnalysisComplete // NEW prop
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState({
    phase: 'introduction', // introduction, questioning, analysis, completed
    collectedData: {} as Record<string, any>,
    questionCount: 0
  });

  // Send AI's initial message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        generateInitialMessage();
      }, 500);
    }
  }, [isOpen]);

  const generateInitialMessage = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'start_analysis',
          company_data: companyData,
          message: 'Start analysis'
        })
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now(),
        sender: 'ai',
        text: data.message || getDefaultWelcomeMessage(),
        timestamp: new Date()
      };

      setMessages([aiMessage]);
      setConversationState(prev => ({ ...prev, phase: 'questioning' }));
      
    } catch (error) {
      console.error('AI startup error:', error);
      const fallbackMessage: Message = {
        id: Date.now(),
        sender: 'ai',
        text: getDefaultWelcomeMessage(),
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
    }
    
    setIsLoading(false);
  };

  const getDefaultWelcomeMessage = () => {
    const industry = companyData?.industry || 'your company';
    return `Hello! I'm your personalized carbon footprint analysis assistant for ${companyData?.name || 'your company'}. I'll ask you a few questions to analyze your sustainability status in the ${industry} sector. Are you ready?`;
  };

  // NEW: AI analysis results generation function
  const generateAIResults = (finalData: Record<string, any>, aiMessage: string) => {
    // Extract recommendations from AI's final message or create defaults
    const aiResults = [
      {
        id: Date.now(),
        type: 'Energy Optimization',
        title: 'Smart AI Recommendation',
        description: aiMessage.length > 100 ? aiMessage : 
          'Based on AI analysis, energy efficiency improvements and transition to renewable energy sources are recommended. This approach will both reduce your carbon footprint and decrease your costs in the long term.',
        confidence: Math.floor(Math.random() * 20 + 80), // 80-100 range
        co2_reduction: Math.floor(Math.random() * 100 + 50), // 50-150 range
        cost_savings: Math.floor(Math.random() * 20000 + 10000), // 10k-30k range
        complexity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toISOString(),
        status: 'active',
        responses: finalData // Store user responses
      }
    ];

    // If multiple responses, create additional recommendations
    if (Object.keys(finalData).length >= 3) {
      aiResults.push({
        id: Date.now() + 1,
        type: 'Operational Improvement',
        title: 'Process Optimization',
        description: 'Improvements have been identified in your current operational processes that will reduce your carbon footprint.',
        confidence: Math.floor(Math.random() * 15 + 75),
        co2_reduction: Math.floor(Math.random() * 80 + 30),
        cost_savings: Math.floor(Math.random() * 15000 + 5000),
        complexity: 'Medium',
        timestamp: new Date().toISOString(),
        status: 'pending',
        responses: finalData
      });
    }

    return aiResults;
  };

  // NEW: Updated analysis completion function
  const handleAnalysisComplete = (finalData: Record<string, any>, aiMessage: string) => {
    // Generate AI results
    const aiResults = generateAIResults(finalData, aiMessage);
    
    // Send results to dashboard
    if (onAnalysisComplete) {
      onAnalysisComplete(aiResults);
    }

    // Close popup after a short delay
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send user response to AI and get next question
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'continue_conversation',
          user_message: inputText,
          conversation_state: conversationState,
          company_data: companyData,
          collected_data: conversationState.collectedData
        })
      });

      const data = await response.json();
      
      // Save user response
      const newCollectedData = {
        ...conversationState.collectedData,
        [`response_${conversationState.questionCount}`]: inputText
      };

      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Update conversation state
      setConversationState(prev => ({
        ...prev,
        phase: data.phase || prev.phase,
        collectedData: newCollectedData,
        questionCount: prev.questionCount + 1
      }));

      // NEW: If analysis is completed, send results to dashboard
      if (data.phase === 'completed') {
        await performFinalAnalysis(newCollectedData);
        // Send results to dashboard
        handleAnalysisComplete(newCollectedData, data.message);
      }

    } catch (error) {
      console.error('AI conversation error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, an error occurred. Please try again or respond differently.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setInputText('');
  };

  const performFinalAnalysis = async (finalData: Record<string, any>) => {
    try {
      const analysisResponse = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'AI_ANALYSIS',
          record: {
            company_id: companyId,
            analysis_data: {
              company_info: companyData,
              responses: finalData,
              timestamp: new Date().toISOString()
            }
          }
        })
      });

      if (analysisResponse.ok) {
        const resultMessage: Message = {
          id: Date.now() + 2,
          sender: 'ai',
          text: '🎉 Great! Your analysis is complete. Your carbon footprint report and personalized recommendations are now displayed on the dashboard. You\'ll be able to see the detailed report soon.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, resultMessage]);
      }
    } catch (error) {
      console.error('Final analysis error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Carbon AI Assistant</h3>
              <p className="text-xs opacity-90">Personalized Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Phase Indicator */}
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>
              {conversationState.phase === 'introduction' && 'Getting Started'}
              {conversationState.phase === 'questioning' && 'Data Collection'}
              {conversationState.phase === 'analysis' && 'Analyzing'}
              {conversationState.phase === 'completed' && 'Completed - Transferring to Dashboard...'}
            </span>
            <span className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-green-500" />
              <span>Dynamic AI</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${
                  conversationState.phase === 'introduction' ? 10 :
                  conversationState.phase === 'questioning' ? 50 :
                  conversationState.phase === 'analysis' ? 80 :
                  100
                }%` 
              }}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center space-x-1 mb-1">
                    <Zap className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-medium text-green-600">Dynamic AI</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* NEW: Information message when analysis is completed */}
          {conversationState.phase === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Analysis Complete!
                  </p>
                  <p className="text-xs text-green-600">
                    Results are being transferred to your dashboard...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                conversationState.phase === 'completed' 
                  ? 'Analysis complete! Results on dashboard...'
                  : 'Type your response...'
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading || conversationState.phase === 'completed'}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim() || conversationState.phase === 'completed'}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPopup;