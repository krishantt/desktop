import React, { useState, useEffect, useRef } from "react";
import Window from "../../ui/Window";
import type {
  WindowState,
  WindowControls,
  Position,
} from "../../../types/window";
import "./AIChat.css";

/**
 * AI Chat App - Local Browser-Based AI Agent
 *
 * This is a 2026-level implementation showcasing:
 * - Local LLM inference in the browser
 * - WebGPU acceleration capabilities
 * - Offline AI chat functionality
 * - PDF document analysis
 *
 * Current Status: Demo Mode
 * - Uses mock responses to demonstrate the UI/UX
 * - Ready for WebLLM integration when models are available
 * - Fallback to Transformers.js for broader compatibility
 *
 * Future Implementation:
 * - WebLLM with Llama models for advanced inference
 * - ONNX Runtime Web for cross-platform compatibility
 * - WebGPU acceleration for performance
 * - Real PDF content analysis
 */

// AI libraries for real LLM inference
import * as webllm from "@mlc-ai/web-llm";

// Available models configuration
const WEBLLM_MODELS = [
  "Llama-3.2-1B-Instruct-q4f16_1-MLC",
  "Phi-3.5-mini-instruct-q4f16_1-MLC",
];

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface AIChatAppProps {
  windowId: string;
  windowState: WindowState;
  windowControls: WindowControls;
  onPositionChange?: (position: Position) => void;
  pdfContent?: string;
  // onAnalyzePDF?: (content: string) => void; // Unused for now
}

const AIChatApp: React.FC<AIChatAppProps> = ({
  windowId,
  windowState,
  windowControls,
  onPositionChange,
  pdfContent,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [engine, setEngine] = useState<webllm.MLCEngine | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<string>("");
  const [modelName, setModelName] = useState<string>("");
  const [isRestarting, setIsRestarting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize AI models
  useEffect(() => {
    initializeAI();
  }, []);

  const restartAI = async () => {
    setIsRestarting(true);
    setEngine(null);
    setModelStatus("loading");
    setMessages([]);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await initializeAI();
    setIsRestarting(false);
  };

  const initializeAI = async () => {
    try {
      setModelStatus("loading");
      setLoadingProgress("Checking WebGPU support...");

      // Set a timeout for the entire initialization process
      const initTimeout = setTimeout(() => {
        console.warn("AI initialization timeout");
        setModelStatus("error");
        setLoadingProgress("Initialization timeout");
      }, 45000); // 45 second timeout

      // Try to initialize WebLLM first (for WebGPU support)
      try {
        setLoadingProgress("Initializing WebLLM engine...");
        console.log("Initializing WebLLM...");
        const webllmEngine = new webllm.MLCEngine();

        // Set up progress tracking
        webllmEngine.setInitProgressCallback((report) => {
          setLoadingProgress(
            `Loading... ${Math.round(report.progress * 100)}%`
          );
        });

        // Try to load the first available model
        const model = WEBLLM_MODELS[0];
        setLoadingProgress(`Loading ${model}...`);
        console.log(`Loading model: ${model}`);

        await webllmEngine.reload(model);

        setEngine(webllmEngine);
        setModelName(model);
        setModelStatus("ready");
        setLoadingProgress("");
        console.log(`WebLLM initialized successfully!`);

        // Add success message when model loads
        setMessages([
          {
            id: "ready",
            role: "system",
            content: `AI model loaded successfully. Running locally in your browser.`,
            timestamp: new Date(),
          },
        ]);

        clearTimeout(initTimeout);
        return;
      } catch (webllmError) {
        console.warn("WebLLM failed:", webllmError);
        setModelStatus("error");
        setLoadingProgress("Failed to load AI model");
        clearTimeout(initTimeout);
      }

      // If WebLLM fails, show error
      throw new Error("No AI models available");
    } catch (error) {
      console.error("Failed to initialize AI:", error);
      setModelStatus("error");
      setLoadingProgress("Failed to load AI models");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      let response = "";

      // Handle special commands
      if (inputValue.toLowerCase() === "status") {
        const webgpuSupported = "gpu" in navigator;
        const memoryUsage =
          (performance as Performance & { memory?: { usedJSHeapSize: number } })
            .memory?.usedJSHeapSize || 0;
        response = `System Status:
Model: ${modelName || "Loading..."}
WebGPU: ${webgpuSupported ? "Available" : "Not Available"}
PDF: ${pdfContent ? "Loaded" : "No document"}
Memory: ~${Math.round(memoryUsage / 1024 / 1024)}MB

Commands:
• status - Show this info
• analyze - Analyze PDF (if loaded)
• clear - Clear chat
• restart - Restart AI model`;
      } else if (inputValue.toLowerCase() === "restart") {
        response = "Restarting AI engine...";
        setTimeout(() => restartAI(), 500);
      } else if (inputValue.toLowerCase() === "analyze" && pdfContent) {
        response = await analyzeDocument(pdfContent);
      } else if (inputValue.toLowerCase() === "clear") {
        setMessages([]);
        setIsLoading(false);
        return;
      } else {
        // Generate AI response using WebLLM
        if (engine) {
          try {
            const completion = await engine.chat.completions.create({
              messages: [
                {
                  role: "user",
                  content: inputValue,
                },
              ],
              temperature: 0.7,
              max_tokens: 300,
              stream: false,
            });

            response =
              completion.choices[0]?.message?.content ||
              "No response generated.";
          } catch (engineError) {
            console.error("Engine error:", engineError);
            response =
              "Sorry, I encountered an error. Type 'restart' to reload the AI model.";
          }
        } else {
          response =
            "⚠️ AI model not ready. Please wait for initialization to complete.";
        }
      }

      // Update the loading message with the actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading ? { ...msg, content: response, isLoading: false } : msg
        )
      );
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                ...msg,
                content: "❌ Error generating response. Please try again.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeDocument = async (content: string): Promise<string> => {
    if (!engine) {
      return "⚠️ AI model not ready for document analysis.";
    }

    const summary = content.slice(0, 500);
    const stats = {
      chars: content.length.toLocaleString(),
      words: content.split(/\s+/).length.toLocaleString(),
      pages: Math.ceil(content.length / 3000),
    };

    // Use AI to analyze the document
    try {
      const completion = await engine.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Analyze this document and provide key insights. Be concise.\n\nDocument: ${summary}...`,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
        stream: false,
      });

      const analysis =
        completion.choices[0]?.message?.content || "Analysis not available.";

      return `Document Analysis:
Stats: ${stats.chars} chars • ${stats.words} words • ~${stats.pages} pages

${analysis}`;
    } catch (error) {
      console.error("Analysis error:", error);
      return "Error analyzing document. Please try again.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = () => {
    switch (modelStatus) {
      case "ready":
        return "#00ff88";
      case "loading":
        return "#ffaa00";
      case "error":
        return "#ff4444";
      default:
        return "#888";
    }
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => <div key={i}>{line}</div>);
  };

  return (
    <Window
      id={windowId}
      title="AI Chat"
      state={windowState}
      controls={windowControls}
      onPositionChange={onPositionChange}
      className="ai-chat-window"
      resizable={true}
      minWidth={420}
      minHeight={540}
    >
      <div className="ai-chat-container">
        {/* Status Bar */}
        <div className="ai-status-bar">
          <div className="status-indicator">
            <div
              className="status-dot"
              style={{ backgroundColor: getStatusColor() }}
            />
            <span>
              {modelStatus === "loading" &&
                (loadingProgress || "Loading AI Model...")}
              {modelStatus === "ready" &&
                `Ready • ${modelName ? modelName.split("-")[0] : "AI"}`}
              {modelStatus === "error" && "❌ Model Failed"}
            </span>
          </div>
          {pdfContent && <div className="pdf-indicator">📄 PDF Loaded</div>}
          {modelStatus === "loading" && (
            <div className="loading-indicator">⏳ Loading...</div>
          )}
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role} ${message.isLoading ? "loading" : ""}`}
            >
              <div className="message-header">
                <span className="message-role">
                  {message.role === "user"
                    ? "👤"
                    : message.role === "system"
                      ? "💻"
                      : "🤖"}
                  {message.role === "user"
                    ? "You"
                    : message.role === "system"
                      ? "System"
                      : "AI Agent"}
                </span>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">
                {message.isLoading ? (
                  <div className="loading-dots">
                    <span>●</span>
                    <span>●</span>
                    <span>●</span>
                  </div>
                ) : (
                  formatMessage(message.content)
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isRestarting
                ? "Restarting AI..."
                : modelStatus === "ready"
                  ? "Ask me anything... (type 'restart' if errors occur)"
                  : modelStatus === "error"
                    ? "AI model failed - type 'restart' to try again"
                    : "Loading AI model..."
            }
            disabled={isLoading || modelStatus !== "ready" || isRestarting}
            className="message-input"
          />
          <button
            onClick={handleSendMessage}
            disabled={
              !inputValue.trim() ||
              isLoading ||
              modelStatus !== "ready" ||
              isRestarting
            }
            className="send-button"
          >
            {isLoading ? (
              "⏳"
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12L22 2L13 21L11 13L2 12Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </Window>
  );
};

export default AIChatApp;
