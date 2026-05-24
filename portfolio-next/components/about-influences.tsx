"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const influences = [
  {
    name: "Jesus Christ",
    group: "Faith",
    summary: "Purpose, humility, sacrifice, and leadership that starts from service.",
    detail:
      "Jesus shapes how I think about purpose, responsibility, and serving people with the gifts I have. He reminds me that impact is not only measured by scale, but by obedience, love, and the lives touched along the way."
  },
  {
    name: "My parents",
    group: "Family",
    summary: "My mom through her words, and my dad through his steady support.",
    detail:
      "My mom inspires me with the words that keep me grounded and moving forward. My dad inspires me through support, presence, and the quiet strength that makes ambition feel possible."
  },
  {
    name: "Mark Zuckerberg",
    group: "Technology",
    summary: "The discipline of building platforms that connect people globally.",
    detail:
      "I am drawn to the scale and consistency behind products that become part of everyday life. His work reminds me that small technical decisions can grow into systems used by millions."
  },
  {
    name: "Elon Musk",
    group: "Ambition",
    summary: "Bold execution, technical ambition, and difficult problem-solving.",
    detail:
      "His work pushes me to think beyond safe ideas and ask what is possible when technical skill meets urgency, courage, and relentless execution."
  },
  {
    name: "Cristiano Ronaldo",
    group: "Discipline",
    summary: "Consistency, hunger, and excellence built through repetition.",
    detail:
      "Ronaldo represents the kind of discipline that compounds over years. His career reminds me that talent matters, but repeated effort, recovery, and standards matter even more."
  },
  {
    name: "Dunsin Oyekan",
    group: "Devotion",
    summary: "Spiritual depth and craft used as a sincere expression of worship.",
    detail:
      "Dunsin inspires me through devotion and surrender. His work reminds me that creativity can carry conviction, and that excellence can be an act of worship."
  },
  {
    name: "Marcus Aurelius",
    group: "Wisdom",
    summary: "Calm thinking, self-control, and principled leadership.",
    detail:
      "Marcus Aurelius influences how I think about composure, discipline, and responsibility. His writing reminds me to master myself before trying to build or lead anything meaningful."
  },
  {
    name: "Augustus Caesar",
    group: "Strategy",
    summary: "Learning from his uncle's mistakes, then building with restraint.",
    detail:
      "Augustus inspires me because he studied what came before him, including his uncle's mistakes, and built with patience, strategy, and restraint. That kind of learning matters to me."
  }
];

export function AboutInfluences() {
  const [openName, setOpenName] = useState(influences[0].name);

  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-2 shadow-[var(--shadow-card)]">
      <div className="divide-y divide-[var(--border)] overflow-hidden rounded-[1.15rem]">
        {influences.map((item) => {
          const isOpen = openName === item.name;

          return (
            <article key={item.name} className="bg-[var(--surface-strong)]">
              <button
                type="button"
                onClick={() => setOpenName(isOpen ? "" : item.name)}
                className="grid w-full gap-3 px-4 py-4 text-left transition duration-300 hover:bg-[var(--surface)] md:grid-cols-[10rem_1fr_auto] md:items-center md:px-5"
                aria-expanded={isOpen}
              >
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                  {item.group}
                </span>
                <span>
                  <span className="block text-lg font-semibold tracking-tight text-[var(--foreground)]">{item.name}</span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{item.summary}</span>
                </span>
                <span className="relative h-9 w-9 rounded-full border border-[var(--border)] text-[var(--foreground)]">
                  <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition duration-300 ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 md:ml-[10rem] md:px-5">
                      <p className="max-w-3xl rounded-[1rem] bg-[var(--surface)] p-4 text-sm leading-7 text-[var(--foreground)]">
                        {item.detail}
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </div>
  );
}
