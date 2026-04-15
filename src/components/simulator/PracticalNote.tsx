"use client";

import { useState } from "react";
import { MessageSquareQuote, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PracticalNoteProps {
  note: string;
}

export function PracticalNote({ note }: PracticalNoteProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-edge overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left",
          "hover:bg-raised transition-colors duration-150",
          open && "bg-raised"
        )}
      >
        <MessageSquareQuote
          size={15}
          className="text-violet shrink-0"
          aria-hidden="true"
        />
        <span className="flex-1 text-sm font-medium text-ink">
          From real projects — what I&apos;d tell my past self
        </span>
        {open ? (
          <ChevronUp size={15} className="text-dim shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown size={15} className="text-dim shrink-0" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 bg-raised border-t border-edge">
          <p className="text-sm text-dim leading-relaxed italic">
            &ldquo;{note}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
