import { useState } from "react";
import {
  PenLine,
  PencilRuler,
  FilePlus,
  Rocket,
  LightbulbOff,
  SearchX,
  Gavel,
  MessageSquareOff,
  TrendingDown,
  ChevronRight,
  Zap,
  AlertTriangle,
} from "lucide-react";

interface Item {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const capabilities: Item[] = [
  {
    icon: <PenLine className="w-5 h-5" />,
    title: "Draft in voice",
    body: "Produces drafts that apply all 20 style rules, run a self-check, and default to the tighter 2026 register. Editing takes minutes instead of hours.",
  },
  {
    icon: <PencilRuler className="w-5 h-5" />,
    title: "Edit against voice rules",
    body: "Diagnoses specific rule violations by number and rewrites at the smallest possible scope. It will not rewrite a paragraph that only needs one sentence cut.",
  },
  {
    icon: <FilePlus className="w-5 h-5" />,
    title: "Scaffold posts",
    body: "Creates the .mdx file with draft: true, generates a kebab-case slug, suggests tags from the existing vocabulary, and creates the image directory — then stops.",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Build, commit, push",
    body: "Runs pnpm build first. On failure, stops cold. On green, stages everything, generates a commit message, commits, and pushes. Netlify deploys automatically.",
  },
];

const limitations: Item[] = [
  {
    icon: <LightbulbOff className="w-5 h-5" />,
    title: "Cannot originate an idea",
    body: "The subagent has no access to lived experience — no classroom, no students, no internal sense of what's interesting. It works with what you give it, not what you haven't yet noticed.",
  },
  {
    icon: <SearchX className="w-5 h-5" />,
    title: "Cannot verify a fact",
    body: "It enforces style rules but cannot check whether something is accurate. A false claim in your notes will be drafted into the post without objection.",
  },
  {
    icon: <Gavel className="w-5 h-5" />,
    title: "Over-applies rules in edge cases",
    body: "The self-check is a checklist, not judgment. A sentence that needs 30 words for rhythm gets flagged by rule 8. Deliberate gestures of uncertainty get flattened into declarations.",
  },
  {
    icon: <MessageSquareOff className="w-5 h-5" />,
    title: "Cannot sustain a COMMIT-BIT from scratch",
    body: "The hardest move to automate. Generating one cold — with the right premise, pacing, and restraint — almost never lands. The humor comes out forced or the commitment wobbles.",
  },
  {
    icon: <TrendingDown className="w-5 h-5" />,
    title: "System drifts when not re-ground",
    body: "Long sessions across multiple invocations produce subtle drift. A rule gets applied differently. A register shifts. Consistency is invocation-level, not session-level.",
  },
];

function ItemCard({
  item,
  side,
  isActive,
  onActivate,
}: {
  item: Item;
  side: "capability" | "limitation";
  isActive: boolean;
  onActivate: () => void;
}) {
  const isCap = side === "capability";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      className={`
        group relative flex items-start gap-3 rounded-lg border p-4 cursor-pointer
        transition-all duration-200 text-left w-full
        ${isActive
          ? isCap
            ? "border-emerald-400/60 bg-emerald-50/70 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/30"
            : "border-amber-400/60 bg-amber-50/70 shadow-sm dark:border-amber-500/40 dark:bg-amber-950/30"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800/50"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex-shrink-0 mt-0.5 rounded-md p-1.5 transition-colors duration-200
          ${isActive
            ? isCap
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          }
          group-hover:scale-105 transition-transform
        `}
      >
        {item.icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h4
            className={`
              text-sm font-semibold leading-snug
              ${isActive
                ? isCap
                  ? "text-emerald-800 dark:text-emerald-300"
                  : "text-amber-800 dark:text-amber-300"
                : "text-gray-800 dark:text-gray-200"
              }
            `}
          >
            {item.title}
          </h4>
          <ChevronRight
            className={`
              w-3.5 h-3.5 flex-shrink-0 transition-all duration-200
              ${isActive ? "opacity-100 rotate-90" : "opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0"}
              ${isCap ? "text-emerald-500" : "text-amber-500"}
            `}
          />
        </div>
        <div
          className={`
            grid transition-all duration-300 ease-out
            ${isActive ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}
          `}
        >
          <div className="overflow-hidden">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {item.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CapabilitiesLimits() {
  const [activeCap, setActiveCap] = useState<string | null>(capabilities[0]?.title ?? null);
  const [activeLim, setActiveLim] = useState<string | null>(limitations[0]?.title ?? null);

  return (
    <div className="my-10 not-prose">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <Zap className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Capabilities</span>
        </div>

        {/* Center divider pill */}
        <div className="flex-shrink-0 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          VS
        </div>

        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Limitations</span>
        </div>
      </div>

      {/* Panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Capabilities column */}
        <div className="flex flex-col gap-3">
          {capabilities.map((item) => (
            <ItemCard
              key={item.title}
              item={item}
              side="capability"
              isActive={activeCap === item.title}
              onActivate={() =>
                setActiveCap((prev) => (prev === item.title ? null : item.title))
              }
            />
          ))}
        </div>

        {/* Limitations column */}
        <div className="flex flex-col gap-3">
          {limitations.map((item) => (
            <ItemCard
              key={item.title}
              item={item}
              side="limitation"
              isActive={activeLim === item.title}
              onActivate={() =>
                setActiveLim((prev) => (prev === item.title ? null : item.title))
              }
            />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        Click any item to expand. The first item in each column starts open.
      </p>
    </div>
  );
}
