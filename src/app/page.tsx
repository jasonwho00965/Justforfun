"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Snowflake } from "lucide-react";

// --- 极致粉雪组件 (Canvas 实现，模拟 Google AI Studio) ---
const SnowCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; r: number; d: number; o: number; s: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      particles = [];
      // 200颗极其细小的雪花，营造密密麻麻的温馨感
      for (let i = 0; i < 200; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.3,
          d: Math.random() * 0.5 + 0.2, 
          o: Math.random() * 0.5 + 0.1,
          s: Math.random() * 1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      particles.forEach(p => {
        ctx.beginPath();
        ctx.globalAlpha = p.o;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        ctx.fill();
        p.y += p.d;
        p.x += Math.sin(p.s + p.y / 60) * 0.3;
        if (p.y > canvas.height) p.y = -5;
        if (p.x > canvas.width) p.x = 0;
        else if (p.x < 0) p.x = canvas.width;
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", init);
    init();
    draw();
    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-20" />;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState("idle");
  const [response, setResponse] = useState("");
  const [isSnowing, setIsSnowing] = useState(true); // 默认开启下雪

  const HeartPulse = () => (
    <motion.div
      animate={{
        scale: [1, 1.15, 1.05, 1.15, 1],
        opacity: [0.4, 0.8, 0.6, 0.8, 0.4],
        filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="flex items-center justify-center"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-200/60 shadow-orange-500/50">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.727 4 2.015Q12.454 3 14.5 3c2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    </motion.div>
  );

  useEffect(() => { setMounted(true); }, []);

 const handleSend = async () => {
    if (!input || status !== "idle") return;
    setStatus("sending");
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await res.json();
      
      // 如果后端返回了错误信息，我们直接抛出，不再走默认回复
      if (!res.ok) {
        throw new Error(data.error || "Server Error");
      }
      
      if (data.text) {
        // 在 handleSend 中找到 setResponse(data.text);
// 替换为以下代码，实现“渐进式打字”效果：

let fullText = data.text;
let currentText = "";
let i = 0;

const typeWriter = () => {
  if (i < fullText.length) {
    currentText += fullText.charAt(i);
    setResponse(currentText); // 每一格时间更新一个字
    i++;
    setTimeout(typeWriter, 120); // 120ms 一个字，像呼吸一样自然
  }
};

typeWriter();
        setStatus("received");
        setInput(""); 
      }
    } catch (error: any) {
      console.error("Detailed Error:", error);
      // 只有在彻底没头绪时才显示默认回复，方便调试
      setResponse(`连接星空时出了一点小差错 (${error.message || "Unknown Error"})`);
      setStatus("received");
    }
  };

  if (!mounted) return <main className="min-h-screen bg-[#0d0d0d]" />;

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#0d0d0d]">
      {/* 1. Canvas 下雪层 */}
      {isSnowing && <SnowCanvas />}

      {/* 2. 左下角 Let it snow 按钮 */}
      <div className="fixed bottom-10 left-10 z-50">
        <button 
          onClick={() => setIsSnowing(!isSnowing)}
          className={`flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase transition-all duration-700 ${
            isSnowing ? 'text-orange-200/80' : 'text-white/10 hover:text-white/40'
          }`}
        >
          <Snowflake size={14} className={isSnowing ? "animate-pulse" : ""} />
          <span>Let it snow</span>
        </button>
      </div>

      {/* 背景光晕 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-900/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      <motion.div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[40px] border border-white/10 p-10 shadow-2xl min-h-[400px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {status === "received" ? (
              <motion.div 
                key="response"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-8 py-10"
              >
                <p className="text-white/80 text-center leading-relaxed font-light italic tracking-wide">
                  {response}
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="text-[9px] tracking-[0.4em] text-white/20 uppercase hover:text-white/40 transition-colors"
                >
                  Back to silence
                </button>
              </motion.div>
            ) : (
              <motion.div key="input" exit={{ opacity: 0, y: -20 }} className="flex flex-col space-y-10">
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-[1px] w-8 bg-white/10" />
                  <Sparkles className={`w-4 h-4 transition-colors duration-1000 ${status === 'sending' ? 'text-orange-200 animate-pulse' : 'text-orange-100/30'}`} />
                  <div className="h-[1px] w-8 bg-white/10" />
                </div>

                <div className="text-center space-y-3">
                  <h1 className="text-lg font-extralight tracking-[0.25em] text-white/90 uppercase">Quiet Moment</h1>
                  <p className="text-sm text-white/60 font-light tracking-wide italic">在此处，你可以卸下所有重担</p>
                </div>

                <div className="relative pt-4">
                  <textarea
                    disabled={status === "sending"}
                    value={input}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-white/80 text-lg font-light leading-relaxed h-32 resize-none"
                    placeholder=""
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5" />
                  <motion.div 
                    animate={{ width: isFocused || input ? "100%" : "0%" }}
                    className="absolute bottom-0 left-0 h-[1px] bg-orange-200/40"
                  />
                </div>

                <div className="flex justify-center">
                  <motion.button
                    onClick={handleSend}
                    whileTap={{ scale: 0.98 }}
                    className={`text-[10px] tracking-[0.4em] uppercase transition-all duration-700 ${
                      input && status === "idle" ? "text-orange-100/70" : "text-white/10"
                    }`}
                  >
                    {status === "sending" ? <HeartPulse /> : (input ? "Release to Starlight" : "Send to Silence")}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}