/**
 * ETEC 522 Participation Portfolio — typed data model.
 *
 * Each entry maps to a real posting or peer comment from the course weblog.
 * Quotes are extracted verbatim from the author's own published work and
 * comment history.
 */

export type Phase = 1 | 2 | 3;

export type EntryType =
  | "blog-post"
  | "oer"
  | "audit"
  | "pitch"
  | "mvp"
  | "comment";

export interface PortfolioEntry {
  /** Stable slug for the entry. */
  id: string;
  /** ISO date of the contribution (not necessarily the parent post). */
  date: string;
  title: string;
  phase: Phase;
  type: EntryType;
  /** "My Role" — what I actually did. */
  role: string;
  /** The "So What?" — why it mattered. */
  summary: string;
  /** Verbatim pull-quote from my published work. */
  quote: string;
  /** Canonical link to the original post / comment. */
  url: string;
}

export interface PhaseMeta {
  phase: Phase;
  /** Short header label. */
  title: string;
  /** Full label used in the timeline. */
  label: string;
  /** One-line description of the stage. */
  description: string;
  /** Spine accent colour (hex). */
  color: string;
  /** Soft tint used behind phase markers. */
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
      "Founder studies and first venture-pitch reviews — learning to read the market.",
    color: "#4862e5", // royal-blue
    tint: "#eef1fe",
  },
  {
    phase: 2,
    title: "OER Leadership & Analyst Work",
    label: "Phase 2 · Mid-Stage OER Leadership & Analyst Work",
    description:
      "Co-developing an OER, running an opportunity audit, and deepening peer discourse.",
    color: "#2f9e4f", // green
    tint: "#eafaf0",
  },
  {
    phase: 3,
    title: "Late-Stage Ventures & Building",
    label: "Phase 3 · Late-Stage Ventures & Technological Capacity",
    description:
      "Pitching my own venture and shipping the Cadenza Studio MVP.",
    color: "#e54848", // cinnabar
    tint: "#fdeeee",
  },
];

/* ------------------------------------------------------------------ */
/* Portfolio entries                                                   */
/* ------------------------------------------------------------------ */

export const portfolioEntries: PortfolioEntry[] = [
  {
    id: "founders-parade",
    date: "2026-06-14",
    title: "Adrian Holovaty – Co-Founder of Soundslice",
    phase: 1,
    type: "blog-post",
    role: "Founder analyst — profiled the inventor-entrepreneur behind Soundslice (and co-creator of Django), tracing how passion, technical skill, and firsthand experience converge in a viable music-tech venture.",
    summary:
      "Held an educator-musician's mirror up against a founder who solved his own lived problem. It set the frame for my whole term: understanding where I sit on the inventor–entrepreneur–innovator spectrum, and which market-building instincts I would need to develop.",
    quote:
      "Looking at his journey makes me reflect on my relationship towards the inventor-entrepreneur-innovator spectrum and what market-building instincts I would need to develop to accomplish what he has.",
    url: "https://jeremysheeshka.ca/posts/2026-06-14-etec522-founders-parade/",
  },
  {
    id: "freedrum-vr-barrier",
    date: "2026-06-07",
    title: "Freedrum 3.0 — The VR Barrier",
    phase: 1,
    type: "comment",
    role: "Peer investor — pushed back on an affordability pitch where a required VR headset quietly undermined the whole value proposition.",
    summary:
      "Spotted that the 'accessibility' framing collapsed the moment the user needed a several-hundred-dollar VR headset before even subscribing, and that the first-to-market claim didn't survive a look at competitors already moving into the space.",
    quote: "I like the concept, but I am buying the venture not the dream.",
    url: "https://blogs.ubc.ca/etec522/2025/07/18/freedrum-3-0-the-future-of-digital-drumming/#comment-6155",
  },
  {
    id: "adaptive-technology-ieps-oer",
    date: "2026-06-20",
    title: "Adaptive Technology & IEPs — An OER",
    phase: 2,
    type: "oer",
    role: "Co-developer and discussion facilitator — built the OER with my team and hosted the cohort's week-long assistive-tech conversation.",
    summary:
      "Co-created an open educational resource on how adaptive learning technology intersects with IEPs, forecasting 'Integrated Adaptive Learning Ecosystems' that centre student agency, then led the cohort discussion on the venture landscape around assistive tech.",
    quote: "Research, design, facilitate, revise: the full cycle.",
    url: "https://jeremysheeshka.ca/posts/2026-06-20-adaptive-technology-ieps-oer/",
  },
  {
    id: "analyst-report-sight-reading-factory",
    date: "2026-06-28",
    title: "Opportunity Audit — Sight Reading Factory",
    phase: 2,
    type: "audit",
    role: "Educational Venture Analyst — produced a structured EVA of Sight Reading Factory across team, concept, marketability, and plan, with an explicit score.",
    summary:
      "Applied the EVA lens to a tool I had never used, asking whether a genuinely useful educational technology also holds up as a long-term investment — separating pedagogical merit from market durability.",
    quote: "Do useful educational technologies always align as sound long-term investments?",
    url: "https://jeremysheeshka.ca/posts/2026-06-28-etec522-analyst-report/",
  },
  {
    id: "microlearning-timbit",
    date: "2026-07-01",
    title: "Microlearning — The Timbit of Microknowledge",
    phase: 2,
    type: "comment",
    role: "Thread contributor — reframed the microlearning debate from 'does it work' to 'what are we actually measuring when we call it successful.'",
    summary:
      "Introduced a memorable metaphor for microlearning's limits — a 'Timbit of microknowledge' versus the 'full holistic donut of understanding' — while acknowledging its genuine value as a market entry point for learners and investors.",
    quote:
      "More like a Timbit of microknowledge rather than being the full holistic donut of understanding of the bigger picture.",
    url: "https://blogs.ubc.ca/etec522/2026/06/28/an-opportunity-forecast-usable-microlearning/#comment-6268",
  },
  {
    id: "ai-critical-thinking-calibrated-doubt",
    date: "2026-08-01",
    title: "AI & Critical Thinking — Calibrated Doubt",
    phase: 2,
    type: "comment",
    role: "Respondent — engaged the Week 11 OER's two-axis framework and connected it to my own teaching practice.",
    summary:
      "Argued the AI conversation should shift from 'should AI belong in education' to 'is the actual thinking still landing with the learner,' and championed Calibrated Doubt as a way to reward questioning the system rather than punish error.",
    quote:
      "Combining that with Calibrated Doubt, where students are told upfront that mistakes are intentionally planted to reward questioning the system through an application of critical thinking rather than punishing them for getting it wrong, is a brilliant way to reframe how students interact with both AI and information in general.",
    url: "https://blogs.ubc.ca/etec522/2026/07/26/week-11-artificial-intelligence-critical-thinking/#comment-6433",
  },
  {
    id: "venture-pitch-curator",
    date: "2026-08-09",
    title: "Venture Pitch — Introducing Curator",
    phase: 3,
    type: "pitch",
    role: "Founder — wrote and delivered a formal venture pitch for Curator, a local-first AI infrastructure play, with a $90,000 pre-seed ask.",
    summary:
      "Pitched open-source, local-first AI that runs on hardware a school or studio already owns, so sensitive student and client data never has to leave the building — a direct answer to the privacy liabilities I had flagged all term.",
    quote:
      "It is infrastructure that makes it structurally impossible for your data to leave the building unless you explicitly choose to share it.",
    url: "https://jeremysheeshka.ca/posts/2026-08-09-curator-introduction/",
  },
  {
    id: "cadenza-studio-mvp",
    date: "2026-08-09",
    title: "Cadenza Studio — The Builder's Showcase",
    phase: 3,
    type: "mvp",
    role: "Solo builder — designed and shipped a working minimum viable product to stress-test Curator's thesis against reality.",
    summary:
      "Moved from theorizing to building: a self-hosted, local-first application that handles scheduling, invoicing, family messaging, practice tracking, and student records, with AI that listens to lessons and does the paperwork. The tangible leap from commenting to shipping.",
    quote:
      "I became determined enough in my choice of venture that I had to build a minimum viable prototype of my own to try these ideas against reality.",
    url: "https://jeremysheeshka.ca/posts/2026-08-09-curator-introduction/",
  },
  {
    id: "cisp-esports-marketability",
    date: "2026-08-12",
    title: "CISP Esports Academy — Marketability & Hardware",
    phase: 3,
    type: "comment",
    role: "Peer investor — leveraged a former pro-gamer background to give the esports pitch a credibility-checked EVA read.",
    summary:
      "Validated the pitch's intrinsic-motivation insight, then pressure-tested its two biggest risks: local marketability in Phnom Penh, and the hidden recurring costs of games and hardware required to keep the experience meaningful year after year.",
    quote:
      "Convincing external families to pay for Esports coaching instead of traditional tutoring, music lessons, or established sports like soccer/basketball might be a tough sell initially.",
    url: "https://blogs.ubc.ca/etec522/2026/08/12/cisp-esports-academy/#comment-6756",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function getEntriesByPhase(phase: Phase): PortfolioEntry[] {
  return portfolioEntries.filter((entry) => entry.phase === phase);
}

export function getPhaseMeta(phase: Phase): PhaseMeta | undefined {
  return phases.find((p) => p.phase === phase);
}

/** Human-readable label for an entry type. */
export const entryTypeLabels: Record<EntryType, string> = {
  "blog-post": "Blog Post",
  oer: "OER",
  audit: "Analyst Report",
  pitch: "Venture Pitch",
  mvp: "MVP",
  comment: "Peer Comment",
};
