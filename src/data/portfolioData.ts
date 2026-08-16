/**
 * ETEC 522 Participation Portfolio — typed data model.
 *
 * Two collections:
 *  - `postings`: the list of discussion posts and peer reviews contributed
 *    during the course (the "5–10 postings and reviews" requirement).
 *  - `works`: the major assignments produced alongside, shown as an aside.
 *
 * Quotes are extracted verbatim from the author's own discussion posts and
 * comment history.
 */

export type Phase = 1 | 2 | 3;

export type EntryKind = "discussion" | "review";

export interface PostingEntry {
  /** Stable slug for the entry. */
  id: string;
  /** ISO date of the contribution. */
  date: string;
  title: string;
  phase: Phase;
  /** Whether this is a weekly discussion post or a peer review/comment. */
  kind: EntryKind;
  /** Short verbatim excerpt. */
  quote: string;
  /** Canonical link (peer reviews); discussion posts have none. */
  url?: string;
}

export interface WorkEntry {
  id: string;
  date: string;
  title: string;
  /** One-line description of the assignment. */
  description: string;
  url: string;
  /** Highlight (the Cadenza Studio MVP). */
  featured?: boolean;
}

export interface PhaseMeta {
  phase: Phase;
  title: string;
  label: string;
  description: string;
  color: string;
  tint: string;
}

/* ------------------------------------------------------------------ */
/* Course phases                                                       */
/* ------------------------------------------------------------------ */

export const phases: PhaseMeta[] = [
  {
    phase: 1,
    title: "Early-Stage Exploration",
    label: "Phase 1 · Early-Stage Exploration",
    description:
      "Weeks 1–4: the changemaker discussions, founder studies, and first venture-pitch reviews.",
    color: "#4862e5", // royal-blue
    tint: "#eef1fe",
  },
  {
    phase: 2,
    title: "Mid-Stage Deepening",
    label: "Phase 2 · Mid-Stage Deepening",
    description:
      "Weeks 5–11: opportunity forecasts, OER leadership, and the immersive and AI modules.",
    color: "#2f9e4f", // green
    tint: "#eafaf0",
  },
  {
    phase: 3,
    title: "Late-Stage Ventures",
    label: "Phase 3 · Late-Stage Ventures",
    description:
      "Weeks 12–13: formal venture-pitch reviews and the closing question of who owns the future of learning.",
    color: "#e54848", // cinnabar
    tint: "#fdeeee",
  },
];

/* ------------------------------------------------------------------ */
/* Postings & reviews (the 5–10 list)                                  */
/* ------------------------------------------------------------------ */

export const postings: PostingEntry[] = [
  {
    id: "are-you-a-changemaker",
    date: "2026-05-30",
    title: "Are you a changemaker?",
    phase: 1,
    kind: "discussion",
    quote:
      "I would define myself as a changemaker who picks and chooses which tide to ride and which to swim against.",
  },
  {
    id: "how-do-you-invest",
    date: "2026-06-07",
    title: "How do you invest?",
    phase: 1,
    kind: "discussion",
    quote:
      "Where I put real effort is into deliberately building a chosen set of skills, honing a toolbox of well-worn, reliable tools.",
  },
  {
    id: "freedrum-vr-barrier",
    date: "2026-06-07",
    title: "Freedrum 3.0 — The VR Barrier",
    phase: 1,
    kind: "review",
    quote: "I like the concept, but I am buying the venture not the dream.",
    url: "https://blogs.ubc.ca/etec522/2025/07/18/freedrum-3-0-the-future-of-digital-drumming/#comment-6155",
  },
  {
    id: "pool-maro-diagnosis-gap",
    date: "2026-06-07",
    title: "Pool Maro — The 11-Year Diagnosis Gap",
    phase: 1,
    kind: "review",
    quote:
      "An 11 year gap between a child showing symptoms and getting help is a powerful number, and the pitch builds everything around it.",
    url: "https://blogs.ubc.ca/etec522/2024/01/28/pitch-pool-maro/#comment-6156",
  },
  {
    id: "whats-your-ride",
    date: "2026-06-13",
    title: "What's your ride?",
    phase: 1,
    kind: "discussion",
    quote:
      "You do not always need to create original ideas to create original value.",
  },
  {
    id: "microlearning-timbit",
    date: "2026-07-01",
    title: "Microlearning — The Timbit of Microknowledge",
    phase: 2,
    kind: "review",
    quote:
      "More like a Timbit of microknowledge rather than being the full holistic donut of understanding of the bigger picture.",
    url: "https://blogs.ubc.ca/etec522/2026/06/28/an-opportunity-forecast-usable-microlearning/#comment-6268",
  },
  {
    id: "immersive-vr-tiered",
    date: "2026-07-11",
    title: "Immersive Experiences — A Tiered Path",
    phase: 2,
    kind: "review",
    quote:
      "The tiered approach to implementation, whether a school has one headset, a class set, or none at all, is a good example of how that sustainability could actually play out in a classroom.",
    url: "https://blogs.ubc.ca/etec522/2026/07/05/week-8-immersive-experiences-in-education/#comment-6297",
  },
  {
    id: "ai-calibrated-doubt",
    date: "2026-08-01",
    title: "AI & Critical Thinking — Calibrated Doubt",
    phase: 2,
    kind: "review",
    quote:
      "The whole conversation shifts to being less about whether AI belongs in education and more about whether the actual thinking is still landing with the learner.",
    url: "https://blogs.ubc.ca/etec522/2026/07/26/week-11-artificial-intelligence-critical-thinking/#comment-6433",
  },
  {
    id: "cisp-esports-marketability",
    date: "2026-08-12",
    title: "CISP Esports — Marketability & Hardware",
    phase: 3,
    kind: "review",
    quote:
      "Convincing external families to pay for Esports coaching instead of traditional tutoring, music lessons, or established sports like soccer/basketball might be a tough sell initially.",
    url: "https://blogs.ubc.ca/etec522/2026/08/12/cisp-esports-academy/#comment-6756",
  },
  {
    id: "who-owns-the-future",
    date: "2026-08-16",
    title: "Who owns the future of learning?",
    phase: 3,
    kind: "discussion",
    quote:
      "The future of learning is temporarily owned by those who are able to identify and navigate that very space of institutional and marketplace frictions.",
  },
];

/* ------------------------------------------------------------------ */
/* Major works (assignments — shown as an aside)                       */
/* ------------------------------------------------------------------ */

export const works: WorkEntry[] = [
  {
    id: "founders-parade",
    date: "2026-06-14",
    title: "Founders on Parade — Adrian Holovaty",
    description:
      "Profiled the Soundslice co-founder (and Django co-creator) through an inventor–entrepreneur lens.",
    url: "https://jeremysheeshka.ca/posts/2026-06-14-etec522-founders-parade/",
  },
  {
    id: "adaptive-technology-ieps-oer",
    date: "2026-06-20",
    title: "Adaptive Technology & IEPs — An OER",
    description:
      "Co-developed an open educational resource on adaptive technology, IEPs, and student agency.",
    url: "https://jeremysheeshka.ca/posts/2026-06-20-adaptive-technology-ieps-oer/",
  },
  {
    id: "analyst-report",
    date: "2026-06-28",
    title: "Opportunity Audit — Sight Reading Factory",
    description:
      "An Educational Venture Analysis of a music-literacy tool: team, concept, marketability, and plan.",
    url: "https://jeremysheeshka.ca/posts/2026-06-28-etec522-analyst-report/",
  },
  {
    id: "venture-pitch-cadenza",
    date: "2026-08-09",
    title: "Venture Pitch — Curator & Cadenza Studio",
    description:
      "Pitched local-first AI infrastructure and shipped the Cadenza Studio MVP to test it against reality.",
    url: "https://jeremysheeshka.ca/posts/2026-08-09-curator-introduction/",
    featured: true,
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function getPostingsByPhase(phase: Phase): PostingEntry[] {
  return postings.filter((entry) => entry.phase === phase);
}

export function getPhaseMeta(phase: Phase): PhaseMeta | undefined {
  return phases.find((p) => p.phase === phase);
}

/** Human-readable label for an entry kind. */
export const entryKindLabels: Record<EntryKind, string> = {
  discussion: "Discussion",
  review: "Peer Review",
};
