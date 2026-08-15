import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  ShieldCheck, 
  ShieldAlert, 
  Minimize2, 
  Maximize2,
  BookOpen,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function RAGChatOverlay({ 
  isOpen = true, 
  onToggle, 
  applicantData, 
  predictionResult,
  externalPrompt,
  onClearExternalPrompt,
  isEmbedded = false
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your **AI Underwriter & Regulatory Assistant**. You can ask me about **RBI compliance guidelines**, **internal credit policy rules**, or **CIBIL metric definitions** for your loan applicants.`,
      citations: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, loading]);

  // If launched with an external initial prompt (e.g. from modal button)
  useEffect(() => {
    if (externalPrompt && isOpen) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery.trim();
    if (!query || loading) return;

    const userMsg = { role: 'user', content: query };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    if (!textToSend) setInputQuery('');
    setLoading(true);
    setError(null);

    // Format chat history for API payload (only pass user and assistant turns)
    const historyPayload = updatedMessages.map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat-rag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          history: historyPayload,
          risk_tier: predictionResult?.risk_tier || null,
          probability: predictionResult?.probability || null,
          applicant_data: applicantData || null
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned status ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          citations: data.policy_citations || []
        }
      ]);
    } catch (err) {
      console.error('RAG chat error:', err);
      setError(err.message || 'Failed to get answer from AI Assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation reset. Ask me any question regarding **RBI lending norms**, **credit risk rules**, or **applicant risk factors**.`,
        citations: []
      }
    ]);
    setError(null);
  };

  const starterQuestions = [
    "Why is this applicant assigned to this Risk Tier?",
    "Is this risk evaluation compliant with RBI guidelines?",
    "Explain 30+ DPD and balance ratio metrics for this profile.",
    "What exception criteria apply for conditional approval?"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 flex items-center gap-2.5 px-4 py-3 rounded-full text-white font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
        style={{
          zIndex: 200,
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="relative">
          <Bot size={22} />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <span className="text-sm font-bold tracking-wide">RAG AI Underwriter</span>
      </button>
    );
  }

  return (
    <div
      className={isEmbedded ? "w-full h-full flex flex-col overflow-hidden" : "fixed bottom-6 right-6 flex flex-col overflow-hidden select-none"}
      style={
        isEmbedded
          ? {
              width: '100%',
              height: '100%',
              minHeight: '520px',
              borderRadius: '16px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)'
            }
          : {
              zIndex: 200,
              width: isMinimized ? '310px' : 'min(450px, 92vw)',
              height: isMinimized ? '48px' : 'min(640px, 85vh)',
              borderRadius: isMinimized ? '24px' : '20px',
              background: 'var(--bg-card-solid)',
              border: isMinimized ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-glass)',
              boxShadow: isMinimized 
                ? '0 8px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(99, 102, 241, 0.25)'
                : '0 20px 50px rgba(0, 0, 0, 0.35), 0 0 30px rgba(99, 102, 241, 0.2)',
              color: 'var(--text-main)',
              transition: 'all 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: isMinimized ? 'pointer' : 'default'
            }
      }
      onClick={(!isEmbedded && isMinimized) ? () => setIsMinimized(false) : undefined}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-3.5 select-none shrink-0"
        style={{
          height: '48px',
          background: (isMinimized && !isEmbedded) 
            ? 'transparent'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
          borderBottom: (isMinimized && !isEmbedded) ? 'none' : '1px solid var(--border-glass)',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="flex items-center gap-2.5">
          <div 
            style={{
              padding: (isMinimized && !isEmbedded) ? '5px' : '6px',
              borderRadius: (isMinimized && !isEmbedded) ? '50%' : '10px',
              background: (isMinimized && !isEmbedded) 
                ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' 
                : 'rgba(99, 102, 241, 0.2)',
              border: (isMinimized && !isEmbedded) ? 'none' : '1px solid rgba(99, 102, 241, 0.3)',
              color: (isMinimized && !isEmbedded) ? '#ffffff' : '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            <Bot size={(isMinimized && !isEmbedded) ? 16 : 18} />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold tracking-wide shrink-0" style={{ color: 'var(--text-main)', margin: 0, lineHeight: 1 }}>
              {(isMinimized && !isEmbedded) ? 'AI Assistant' : 'RAG AI Policy Assistant'}
            </h3>

            {(!isMinimized || isEmbedded) && <Sparkles size={14} className="text-purple-500 animate-pulse shrink-0" />}

            {(isMinimized && !isEmbedded) && predictionResult && (
              <span 
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  background: 'rgba(99, 102, 241, 0.18)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  color: '#a5b4fc',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  lineHeight: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                Tier {predictionResult.risk_tier}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {!isEmbedded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)', background: 'transparent' }}
              title={isMinimized ? "Expand Assistant" : "Minimize Assistant"}
            >
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={15} />}
            </button>
          )}
          {(!isMinimized || isEmbedded) && (
            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)', background: 'transparent' }}
              title="Reset Conversation"
            >
              <RotateCcw size={15} />
            </button>
          )}
          {!isEmbedded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)', background: 'transparent' }}
              title="Close Assistant"
            >
              <X size={isMinimized ? 14 : 16} />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content Area */}
      <div
        className="flex-1 flex flex-col min-h-0"
        style={{
          opacity: isMinimized ? 0 : 1,
          visibility: isMinimized ? 'hidden' : 'visible',
          transform: isMinimized ? 'translateY(12px) scale(0.97)' : 'translateY(0) scale(1)',
          pointerEvents: isMinimized ? 'none' : 'auto',
          transition: 'opacity 0.22s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.22s'
        }}
      >
        {/* Active Applicant Context Banner */}
        {predictionResult ? (
          <div 
            className="px-3.5 py-2 text-xs flex items-center justify-between"
            style={{
              background: 'var(--input-bg)',
              borderBottom: '1px solid var(--border-glass)',
              color: 'var(--text-main)'
            }}
          >
            <span className="flex items-center gap-1.5 font-medium">
              {predictionResult.risk_tier === 'P1' || predictionResult.risk_tier === 'P2' ? (
                <ShieldCheck size={14} className="text-emerald-500" />
              ) : (
                <ShieldAlert size={14} className="text-amber-500" />
              )}
              Active Applicant: <strong>Tier {predictionResult.risk_tier} ({predictionResult.probability}%)</strong>
            </span>
          </div>
        ) : applicantData ? (
          <div 
            className="px-3.5 py-2 text-xs flex items-center gap-1.5"
            style={{
              background: 'var(--input-bg)',
              borderBottom: '1px solid var(--border-glass)',
              color: 'var(--text-muted)'
            }}
          >
            <BookOpen size={13} className="text-cyan-500" />
            <span>Loaded Form Profile (₹{Number(applicantData.NETMONTHLYINCOME || 0).toLocaleString()} Income)</span>
          </div>
        ) : null}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className="max-w-[88%] p-3 rounded-2xl"
                style={
                  msg.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        color: '#ffffff',
                        borderTopRightRadius: '2px',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
                      }
                    : {
                        background: 'var(--input-bg)',
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-main)',
                        borderTopLeftRadius: '2px',
                        lineHeight: '1.6'
                      }
                }
              >
                <FormattedMessage text={msg.content} isUser={msg.role === 'user'} />
              </div>

              {/* Grounding Policy Citations Grouped Under Label */}
              {msg.citations && msg.citations.length > 0 && (
                <div 
                  className="mt-2 p-2 rounded-xl flex flex-col gap-1.5 max-w-[88%]" 
                  style={{ 
                    background: 'var(--input-bg)', 
                    border: '1px solid var(--border-glass)' 
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <BookOpen size={11} className="text-indigo-400" /> Grounding Policy References:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {msg.citations.map((cite, cIdx) => (
                      <span
                        key={cIdx}
                        style={{
                          fontSize: '0.68rem',
                          background: 'rgba(99, 102, 241, 0.15)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          color: '#818cf8',
                          padding: '2px 7px',
                          borderRadius: '8px',
                          fontWeight: 600
                        }}
                      >
                        {cite.doc_name} • {cite.clause}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div 
              className="flex items-center gap-2 p-3 rounded-2xl w-fit text-xs font-semibold"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-glass)',
                color: '#a855f7',
                borderTopLeftRadius: '2px'
              }}
            >
              <RefreshCw size={14} className="animate-spin text-purple-500" />
              <span>Consulting bank credit policy & RBI guidelines...</span>
            </div>
          )}

          {error && (
            <div 
              className="p-2.5 text-xs rounded-xl flex items-center gap-2"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444'
              }}
            >
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Starter Suggestions */}
        {messages.length <= 2 && !loading && (
          <div 
            className="px-3 py-2 shrink-0"
            style={{
              borderTop: '1px solid var(--border-glass)',
              background: 'var(--input-bg)'
            }}
          >
            <p 
              className="text-[11px] font-semibold mb-1.5 flex items-center gap-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <HelpCircle size={12} className="text-indigo-400" /> Suggested Queries:
            </p>
            <div className="flex flex-col gap-1">
              {starterQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-left text-[11px] px-2.5 py-1 rounded-lg transition-colors flex items-center justify-between group"
                  style={{
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)'
                  }}
                >
                  <span className="truncate">{q}</span>
                  <ChevronRight size={12} className="opacity-60 group-hover:opacity-100 transition-opacity text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 flex items-center gap-2 shrink-0"
          style={{
            borderTop: '1px solid var(--border-glass)',
            background: 'var(--bg-card-solid)'
          }}
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about credit policy, RBI norms, or risk factors..."
            className="flex-1 rounded-xl px-3 py-2 text-xs transition-colors focus:outline-none"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              color: 'var(--text-main)'
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-2 rounded-xl text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}

// Full Markdown Parser Component
function FormattedMessage({ text, isUser }) {
  if (!text) return null;

  if (isUser) {
    return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{text}</div>;
  }

  const rawLines = text.split('\n');
  const blocks = [];
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  rawLines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Dividers
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList();
      blocks.push({ type: 'hr', key: idx });
      return;
    }

    // Headers
    if (trimmed.startsWith('#')) {
      flushList();
      const level = (trimmed.match(/^#+/) || ['#'])[0].length;
      const headerText = trimmed.replace(/^#+\s*/, '');
      blocks.push({ type: 'header', level, text: headerText, key: idx });
      return;
    }

    // Bullet Lists (- or *)
    const bulletMatch = trimmed.match(/^[\-\*]\s+(.*)/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [], key: idx };
      }
      currentList.items.push(bulletMatch[1]);
      return;
    }

    // Numbered Lists (1., 2., etc)
    const numMatch = trimmed.match(/^\d+\.\s+(.*)/);
    if (numMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [], key: idx };
      }
      currentList.items.push(numMatch[1]);
      return;
    }

    // Standard Paragraph Line
    flushList();
    blocks.push({ type: 'p', text: trimmed, key: idx });
  });

  flushList();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {blocks.map((block) => {
        if (block.type === 'hr') {
          return <hr key={block.key} style={{ border: 'none', borderTop: '1px solid var(--border-glass)', margin: '6px 0' }} />;
        }

        if (block.type === 'header') {
          return (
            <h4
              key={block.key}
              style={{
                fontSize: block.level <= 2 ? '0.98rem' : '0.9rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: '6px 0 2px 0',
                lineHeight: 1.3
              }}
            >
              <InlineFormatted text={block.text} />
            </h4>
          );
        }

        if (block.type === 'ul' || block.type === 'ol') {
          const Tag = block.type;
          return (
            <Tag
              key={block.key}
              style={{
                paddingLeft: '18px',
                margin: '2px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              {block.items.map((itemText, iIdx) => (
                <li key={iIdx} style={{ lineHeight: '1.5', color: 'var(--text-main)' }}>
                  <InlineFormatted text={itemText} />
                </li>
              ))}
            </Tag>
          );
        }

        return (
          <p key={block.key} style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-main)' }}>
            <InlineFormatted text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

// Inline formatting helper for **bold**, `code`, and [Citations]
function InlineFormatted({ text }) {
  if (!text) return null;

  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\])/g);

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={idx}
              style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                padding: '1px 5px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85em',
                color: '#38bdf8'
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('[') && part.endsWith(']')) {
          return (
            <span
              key={idx}
              style={{
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#a855f7',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.78em',
                fontWeight: 600,
                display: 'inline-block',
                margin: '0 2px'
              }}
            >
              {part.slice(1, -1)}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}
