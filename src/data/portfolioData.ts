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

export type EntryKind = "canvas-discussion" | "oer-discussion" | "venture-review";

export interface PostingEntry {
  id: string;
  date: string;
  /** The thread topic (not an invented title). */
  title: string;
  phase: Phase;
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
  description: string;
  url: string;
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
      "Weeks 1–4: the Canvas discussions on changemaking, investing, and choosing a ride.",
    color: "#4862e5", // royal-blue
    tint: "#eef1fe",
  },
  {
    phase: 2,
    title: "Mid-Stage Deepening",
    label: "Phase 2 · Mid-Stage Deepening",
    description:
      "Weeks 5–11: OER discussions on microlearning, immersive experiences, and AI & critical thinking.",
    color: "#2f9e4f", // green
    tint: "#eafaf0",
  },
  {
    phase: 3,
    title: "Late-Stage Ventures",
    label: "Phase 3 · Late-Stage Ventures",
    description:
      "Weeks 12–13: venture-pitch reviews and the closing question of who owns the future of learning.",
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
    kind: "canvas-discussion",
    quote:
      "I would define myself as a changemaker who picks and chooses which tide to ride and which to swim against.",
  },
  {
    id: "how-do-you-invest",
    date: "2026-06-07",
    title: "How do you invest?",
    phase: 1,
    kind: "canvas-discussion",
    quote:
      "Where I put real effort is into deliberately building a chosen set of skills, honing a toolbox of well-worn, reliable tools.",
  },
  {
    id: "whats-your-ride",
    date: "2026-06-13",
    title: "What's your ride?",
    phase: 1,
    kind: "canvas-discussion",
    quote:
      "You do not always need to create original ideas to create original value.",
  },
  {
    id: "microlearning",
    date: "2026-07-01",
    title: "Microlearning",
    phase: 2,
    kind: "oer-discussion",
    quote:
      "More like a Timbit of microknowledge rather than being the full holistic donut of understanding of the bigger picture.",
    url: "https://blogs.ubc.ca/etec522/2026/06/28/an-opportunity-forecast-usable-microlearning/#comment-6268",
  },
  {
    id: "immersive-experiences",
    date: "2026-07-11",
    title: "Immersive Experiences in Education",
    phase: 2,
    kind: "oer-discussion",
    quote:
      "The Immersive Experience Team's tiered approach to implementation, whether a school has one headset, a class set, or none at all, is a good example of how that sustainability could actually play out in a classroom.",
    url: "https://blogs.ubc.ca/etec522/2026/07/05/week-8-immersive-experiences-in-education/#comment-6297",
  },
  {
    id: "ai-critical-thinking",
    date: "2026-08-01",
    title: "Artificial Intelligence & Critical Thinking",
    phase: 2,
    kind: "oer-discussion",
    quote:
      "The whole conversation shifts to being less about whether AI belongs in education and more about whether the actual thinking is still landing with the learner.",
    url: "https://blogs.ubc.ca/etec522/2026/07/26/week-11-artificial-intelligence-critical-thinking/#comment-6433",
  },
  {
    id: "cisp-esports",
    date: "2026-08-12",
    title: "CISP Esports Academy",
    phase: 3,
    kind: "venture-review",
    quote:
      "Building a program to capture students already scrimmaging and studying match replays of videogames is a brilliant way to validate their competitive drive intrinsically.",
    url: "https://blogs.ubc.ca/etec522/2026/08/12/cisp-esports-academy/#comment-6756",
  },
  {
    id: "convia",
    date: "2026-08-16",
    title: "Convia",
    phase: 3,
    kind: "venture-review",
    quote:
      "The concept is strong because it shifts technology from an individual activity to a shared physical space.",
    url: "https://blogs.ubc.ca/etec522/2026/08/09/convia-turning-the-classroom-into-a-shared-digital-experience/#comment-6770",
  },
  {
    id: "who-owns-the-future",
    date: "2026-08-16",
    title: "Who owns the future of learning?",
    phase: 3,
    kind: "canvas-discussion",
    quote:
      "I believe the future of learning is temporarily owned by those who are able to identify and navigate that very space of institutional and marketplace frictions.",
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

export const entryKindLabels: Record<EntryKind, string> = {
  "canvas-discussion": "Canvas discussion",
  "oer-discussion": "OER discussion",
  "venture-review": "Venture review",
};
