"use client";

import { useEffect, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

interface TextScrambleProps {
  phrases: string[];
  className?: string;
}

export default function TextScramble({ phrases, className }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(phrases[0] || "");
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let frame: number;
    let currentPhraseIndex = 0;
    
    interface QueueItem {
      from: string;
      to: string;
      start: number;
      end: number;
      char?: string;
    }

    class Scrambler {
      queue: QueueItem[] = [];
      frame = 0;
      resolve: (value?: unknown) => void = () => {};
      
      setText(newText: string, oldText: string) {
        const length = Math.max(oldText.length, newText.length);
        return new Promise((resolve) => {
          this.resolve = resolve;
          this.queue = [];
          for (let i = 0; i < length; i++) {
            const from = oldText[i] || "";
            const to = newText[i] || "";
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
          }
          cancelAnimationFrame(frame);
          this.frame = 0;
          this.update();
        });
      }
      
      update = () => {
        let output = "";
        let complete = 0;
        for (let i = 0; i < this.queue.length; i++) {
          const { from, to, start, end } = this.queue[i];
          let char = this.queue[i].char;
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = CHARS[Math.floor(Math.random() * CHARS.length)];
              this.queue[i].char = char;
            }
            output += char;
          } else {
            output += from;
          }
        }
        setDisplayText(output);
        if (complete === this.queue.length) {
          this.resolve();
        } else {
          frame = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
    }

    const scrambler = new Scrambler();
    
    let isMounted = true;
    let currentText = phrases[0] || "";
    setDisplayText(currentText);

    const loop = async () => {
      while (isMounted) {
        await new Promise((r) => { timeout = setTimeout(r, 2500) });
        if (!isMounted) break;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        const newText = phrases[currentPhraseIndex];
        await scrambler.setText(newText, currentText);
        currentText = newText;
      }
    };
    
    loop();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span className={className}>{displayText}</span>;
}
