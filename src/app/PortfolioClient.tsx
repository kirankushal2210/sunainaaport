"use client";

import { useEffect, useRef, useState, useCallback, createRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Command } from "cmdk";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, X, Search } from "lucide-react";
import Tilt from "react-parallax-tilt";
import ContactForm from "./ContactForm";

gsap.registerPlugin(ScrollTrigger);

/* ───────────── Types ───────────── */
// Intake form — no AI SDK needed

interface Project {
  id: string;
  title: string;
  category: string;
  posterAsset: string;
  aspectRatio: string;
  metrics: string[];
  content: string;
  client: string;
  year: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string[];
}

/* ───────────── Creative Toolset Core Icons ───────────── */
const TOOLSET_CORES = [
  {
    id: "photoshop",
    number: "Core 01",
    title: "Digital Manipulation",
    subtitle: "RETROFIT, LENS",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="psFrame" x1="0" y1="0" x2="56" y2="56">
            <stop offset="0%" stopColor="#c8956c" />
            <stop offset="50%" stopColor="#a0724f" />
            <stop offset="100%" stopColor="#d4a843" />
          </linearGradient>
          <linearGradient id="psCore" x1="10" y1="10" x2="46" y2="46">
            <stop offset="0%" stopColor="#1a2744" />
            <stop offset="100%" stopColor="#0d1a33" />
          </linearGradient>
          <linearGradient id="psGlass" x1="14" y1="8" x2="42" y2="48">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Copper outer frame */}
        <rect x="2" y="2" width="52" height="52" rx="10" fill="url(#psFrame)" opacity="0.3" />
        <rect x="4" y="4" width="48" height="48" rx="8" fill="url(#psCore)" />
        {/* Glass highlight */}
        <rect x="4" y="4" width="48" height="24" rx="8" fill="url(#psGlass)" />
        {/* Inner copper border */}
        <rect x="6" y="6" width="44" height="44" rx="6" fill="none" stroke="#c8956c" strokeWidth="0.5" opacity="0.4" />
        {/* Ps text */}
        <text x="10" y="39" fontFamily="serif" fontSize="26" fontWeight="600" fill="#5cc8e8" opacity="0.9">Ps</text>
        {/* Copper accent corner */}
        <circle cx="44" cy="12" r="2" fill="#c8956c" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: "illustrator",
    number: "Core 02",
    title: "Vector & Illustration",
    subtitle: "PRECISE PATHS",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="aiFrame" x1="0" y1="0" x2="56" y2="56">
            <stop offset="0%" stopColor="#d4a843" />
            <stop offset="50%" stopColor="#c8956c" />
            <stop offset="100%" stopColor="#c8956c" />
          </linearGradient>
          <linearGradient id="aiCore" x1="10" y1="10" x2="46" y2="46">
            <stop offset="0%" stopColor="#3d1e00" />
            <stop offset="100%" stopColor="#2a1500" />
          </linearGradient>
          <linearGradient id="aiGlass" x1="14" y1="8" x2="42" y2="48">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="52" height="52" rx="10" fill="url(#aiFrame)" opacity="0.3" />
        <rect x="4" y="4" width="48" height="48" rx="8" fill="url(#aiCore)" />
        <rect x="4" y="4" width="48" height="24" rx="8" fill="url(#aiGlass)" />
        <rect x="6" y="6" width="44" height="44" rx="6" fill="none" stroke="#d4a843" strokeWidth="0.5" opacity="0.4" />
        <text x="14" y="39" fontFamily="serif" fontSize="26" fontWeight="600" fill="#ff9a2e" opacity="0.9">Ai</text>
        <circle cx="44" cy="12" r="2" fill="#d4a843" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: "brand",
    number: "Core 03",
    title: "Identity Development",
    subtitle: "UNIFYING VISION",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="brassBlock" x1="0" y1="0" x2="56" y2="56">
            <stop offset="0%" stopColor="#d4a843" />
            <stop offset="30%" stopColor="#c8956c" />
            <stop offset="70%" stopColor="#a07850" />
            <stop offset="100%" stopColor="#d4a843" />
          </linearGradient>
          <linearGradient id="brassTop" x1="8" y1="4" x2="48" y2="8">
            <stop offset="0%" stopColor="#e8c88a" />
            <stop offset="100%" stopColor="#c8956c" />
          </linearGradient>
        </defs>
        {/* Letterpress block body */}
        <rect x="8" y="10" width="40" height="40" rx="3" fill="url(#brassBlock)" />
        {/* Top bevel */}
        <rect x="8" y="8" width="40" height="6" rx="2" fill="url(#brassTop)" opacity="0.6" />
        {/* Letter A (raised type) */}
        <text x="14" y="42" fontFamily="serif" fontSize="32" fontWeight="700" fill="#1a1208" opacity="0.85">A</text>
        {/* Clockwork gears */}
        <circle cx="40" cy="38" r="5" fill="none" stroke="#8b6c3f" strokeWidth="1" opacity="0.5" />
        <circle cx="40" cy="38" r="2" fill="#8b6c3f" opacity="0.4" />
        <circle cx="36" cy="43" r="3" fill="none" stroke="#a07850" strokeWidth="0.8" opacity="0.4" />
        <circle cx="36" cy="43" r="1.2" fill="#a07850" opacity="0.3" />
        {/* Gear teeth hints */}
        <line x1="40" y1="33" x2="40" y2="34.5" stroke="#8b6c3f" strokeWidth="0.8" opacity="0.4" />
        <line x1="45" y1="38" x2="43.5" y2="38" stroke="#8b6c3f" strokeWidth="0.8" opacity="0.4" />
        <line x1="40" y1="43" x2="40" y2="41.5" stroke="#8b6c3f" strokeWidth="0.8" opacity="0.4" />
        <line x1="35" y1="38" x2="36.5" y2="38" stroke="#8b6c3f" strokeWidth="0.8" opacity="0.4" />
        {/* Copper patina highlight */}
        <rect x="10" y="12" width="18" height="2" rx="1" fill="rgba(255,255,255,0.15)" />
      </svg>
    ),
  },
  {
    id: "social",
    number: "Core 04",
    title: "Social Content",
    subtitle: "DIGITAL ENGAGEMENT",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="bubbleGlass" x1="6" y1="6" x2="44" y2="44">
            <stop offset="0%" stopColor="rgba(200,220,255,0.2)" />
            <stop offset="50%" stopColor="rgba(180,200,240,0.08)" />
            <stop offset="100%" stopColor="rgba(160,180,220,0.15)" />
          </linearGradient>
          <linearGradient id="copperHeart" x1="20" y1="18" x2="36" y2="38">
            <stop offset="0%" stopColor="#d4a843" />
            <stop offset="50%" stopColor="#c8956c" />
            <stop offset="100%" stopColor="#a07850" />
          </linearGradient>
        </defs>
        {/* Glass chat bubble */}
        <path d="M8 12 C8 8, 12 4, 18 4 L38 4 C44 4, 48 8, 48 12 L48 30 C48 34, 44 38, 38 38 L22 38 L14 46 L14 38 L18 38 C12 38, 8 34, 8 30 Z" fill="url(#bubbleGlass)" stroke="rgba(200,220,255,0.3)" strokeWidth="1" />
        {/* Glass highlight */}
        <path d="M10 12 C10 9, 13 6, 18 6 L38 6 C43 6, 46 9, 46 12 L46 18 C30 22, 14 18, 10 16 Z" fill="rgba(255,255,255,0.08)" />
        {/* Copper heart */}
        <path d="M28 34 C24 30, 18 26, 18 22 C18 18, 22 16, 25 18 C26.5 19.5, 27.5 20.5, 28 22 C28.5 20.5, 29.5 19.5, 31 18 C34 16, 38 18, 38 22 C38 26, 32 30, 28 34 Z" fill="url(#copperHeart)" opacity="0.85" />
        {/* Gold notification dot */}
        <circle cx="46" cy="8" r="5" fill="#d4a843" />
        <circle cx="46" cy="8" r="3.5" fill="#e8c060" />
        <circle cx="45" cy="7" r="1" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
  },
  {
    id: "print",
    number: "Core 05",
    title: "Print & Layout",
    subtitle: "CROP & BLEED",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="paperEdge" x1="8" y1="8" x2="48" y2="48">
            <stop offset="0%" stopColor="#f5f0e6" />
            <stop offset="100%" stopColor="#e8e0d0" />
          </linearGradient>
        </defs>
        {/* Stacked paper sheets */}
        <rect x="14" y="14" width="34" height="38" rx="1" fill="#ddd5c5" opacity="0.4" />
        <rect x="11" y="11" width="34" height="38" rx="1" fill="#e2dace" opacity="0.6" />
        <rect x="8" y="8" width="34" height="38" rx="1" fill="url(#paperEdge)" />
        {/* Shadow edge */}
        <line x1="8" y1="46" x2="42" y2="46" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        {/* CMYK targets — actual circles */}
        <circle cx="14" cy="14" r="2.5" fill="none" stroke="#00bcd4" strokeWidth="0.8" />
        <circle cx="14" cy="14" r="1" fill="#00bcd4" />
        <circle cx="20" cy="14" r="2.5" fill="none" stroke="#e91e63" strokeWidth="0.8" />
        <circle cx="20" cy="14" r="1" fill="#e91e63" />
        <circle cx="26" cy="14" r="2.5" fill="none" stroke="#ffc107" strokeWidth="0.8" />
        <circle cx="26" cy="14" r="1" fill="#ffc107" />
        <circle cx="32" cy="14" r="2.5" fill="none" stroke="#212121" strokeWidth="0.8" />
        <circle cx="32" cy="14" r="1" fill="#212121" />
        {/* Color bars — actual small squares */}
        <rect x="12" y="38" width="4" height="3" fill="#00bcd4" rx="0.3" />
        <rect x="17" y="38" width="4" height="3" fill="#e91e63" rx="0.3" />
        <rect x="22" y="38" width="4" height="3" fill="#ffc107" rx="0.3" />
        <rect x="27" y="38" width="4" height="3" fill="#212121" rx="0.3" />
        <rect x="32" y="38" width="4" height="3" fill="#8bc34a" rx="0.3" />
        {/* Crop marks */}
        <line x1="6" y1="8" x2="6" y2="13" stroke="#333" strokeWidth="0.4" />
        <line x1="6" y1="8" x2="8" y2="8" stroke="#333" strokeWidth="0.4" />
        <line x1="44" y1="8" x2="44" y2="13" stroke="#333" strokeWidth="0.4" />
        <line x1="42" y1="8" x2="44" y2="8" stroke="#333" strokeWidth="0.4" />
        <line x1="6" y1="46" x2="8" y2="46" stroke="#333" strokeWidth="0.4" />
        <line x1="6" y1="41" x2="6" y2="46" stroke="#333" strokeWidth="0.4" />
        {/* Content lines */}
        <rect x="12" y="20" width="22" height="1.5" rx="0.5" fill="rgba(0,0,0,0.12)" />
        <rect x="12" y="24" width="18" height="1.5" rx="0.5" fill="rgba(0,0,0,0.08)" />
        <rect x="12" y="28" width="24" height="1.5" rx="0.5" fill="rgba(0,0,0,0.06)" />
        <rect x="12" y="32" width="16" height="1.5" rx="0.5" fill="rgba(0,0,0,0.08)" />
      </svg>
    ),
  },
];

/* ───────────── Fallback Data ───────────── */

const MOCK_PROJECTS: Project[] = [
  { id: "1", title: "Future Kids - Scholarship Poster", category: "Print", client: "Future Kids", year: "2025", posterAsset: "/projects/fk-scholarship.jpg", aspectRatio: "vertical", metrics: ["10k+ Impressions", "+25% Signups"], content: "Promotional poster for 100% scholarship and aptitude test, highlighting academic excellence." },
  { id: "2", title: "Future Kids - Admissions Open", category: "Social Media", client: "Future Kids", year: "2025", posterAsset: "/projects/fk-admissions.jpg", aspectRatio: "vertical", metrics: ["+140% Engagement"], content: "Creative typography-led admissions open graphic with a welcoming campus environment." },
  { id: "3", title: "The Park Arabian Mandi", category: "Branding", client: "The Park", year: "2025", posterAsset: "/projects/park-mandi-card.jpg", aspectRatio: "horizontal", metrics: ["Brand Identity Established"], content: "Premium business card design with gold foil accents and elegant typography." },
  { id: "4", title: "Wittelsbach - Content Strategy", category: "Social Media", client: "Wittelsbach", year: "2025", posterAsset: "/projects/content-strategy.jpg", aspectRatio: "vertical", metrics: ["Lead Gen Asset"], content: "Bold, visually striking promotional graphic for content strategy services." },
  { id: "5", title: "The Park Arabian Mandi - Packaging", category: "Packaging", client: "The Park", year: "2025", posterAsset: "/projects/mandi-bottle.jpg", aspectRatio: "vertical", metrics: ["Custom FMCG"], content: "Custom water bottle label packaging design with premium forest/animal elements." },
  { id: "6", title: "Bandi Babu - Brand Logo", category: "Branding", client: "Bandi Babu", year: "2024", posterAsset: "/projects/bandi-babu-logo.jpg", aspectRatio: "square", metrics: ["Identity Relaunch"], content: "Character-driven logo design for a traditional food brand featuring custom Telugu typography." },
  { id: "7", title: "Future Kids - Sankranthi Banner", category: "Print", client: "Future Kids", year: "2025", posterAsset: "/projects/fk-sankranthi.jpg", aspectRatio: "horizontal", metrics: ["Event Highlight"], content: "Festive backdrop banner for Sankranthi celebrations featuring cultural elements." },
  { id: "8", title: "Gal Punjabi Dhaba - Menu Design", category: "Print", client: "Gal Punjabi Dhaba", year: "2025", posterAsset: "/projects/punjabi-menu.jpg", aspectRatio: "vertical", metrics: ["Dine-in Utility"], content: "Traditional and extensive dine-in menu design for a Punjabi restaurant." },
];

const MOCK_EXPERIENCES: Experience[] = [
  { id: "1", company: "NarrativeX Media", role: "Graphic Designer", duration: "January 2026 — Present", description: ["Led design of branding, social, print, and digital creatives.", "Collaborated with cross-functional teams."] },
  { id: "2", company: "Wittelsbach", role: "Graphic Designer", duration: "July 2024 — January 2026", description: ["Created social creatives, print materials, digital marketing assets.", "Assisted brand identity development."] },
  { id: "3", company: "MayaBazar Loft", role: "Album & Graphic Designer", duration: "January — March 2024", description: ["Designed wedding album layouts focusing on composition and storytelling."] },
  { id: "4", company: "Exsconicc", role: "Graphic Design & Social Media Intern", duration: "May — Oct 2023", description: ["Designed social media creatives and assisted in managing presence."] },
  { id: "5", company: "Freelance", role: "Graphic Designer, Packaging, Flyers", duration: "Ongoing", description: ["Designed packaging layouts, flyers, banners, and backdrops."] },
];

/* ───────────── Component ───────────── */
export default function PortfolioClient({
  initialProjects,
  initialExperiences,
}: {
  initialProjects: Project[] | null;
  initialExperiences: Experience[] | null;
}) {
  const projects = initialProjects || MOCK_PROJECTS;
  const experiences = initialExperiences || MOCK_EXPERIENCES;

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cvButtonRef = useRef<HTMLAnchorElement>(null);
  const worksRef = useRef<HTMLElement>(null);

  /* ── Filter & Modal State ── */
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeTool, setActiveTool] = useState<string>("All Tools");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalTab, setModalTab] = useState<"Overview" | "Metrics">("Overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Project[]>([]);

  // Keyboard Shortcut for Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch search results
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setSearchResults(data.projects || []));
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);


  // Analytics State
  const [projectStats, setProjectStats] = useState({ views: 0, likes: 0 });
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      // Fetch stats
      fetch(`/api/analytics?projectId=${selectedProject.id}`)
        .then(res => res.json())
        .then(data => setProjectStats({ views: data.views || 0, likes: data.likes || 0 }))
        .catch(console.error);

      // Track view
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProject.id, action: 'view' })
      }).catch(console.error);

      setHasLiked(false);
    }
  }, [selectedProject]);

  const handleLike = async () => {
    if (!selectedProject || hasLiked) return;
    setHasLiked(true);
    setProjectStats(prev => ({ ...prev, likes: prev.likes + 1 }));
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProject.id, action: 'like' })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    return activeCategory === "All" || p.category === activeCategory;
  });

  /* ── Creative Toolset Physics State ── */
  const toolsetContainerRef = useRef<HTMLElement>(null);
  const numCores = TOOLSET_CORES.length; // 5
  const coresPhysics = useRef(
    Array.from({ length: numCores }).map(() => ({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      ref: createRef<HTMLDivElement>()
    }))
  );
  const svgPathsRef = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const updateAnchors = () => {
      const container = toolsetContainerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      const isMobile = width < 768;

      const anchors = isMobile ? [
        { px: 0.5, py: 0.15 },
        { px: 0.5, py: 0.35 },
        { px: 0.5, py: 0.55 },
        { px: 0.5, py: 0.75 },
        { px: 0.5, py: 0.95 },
      ] : [
        { px: 0.2, py: 0.25 },
        { px: 0.8, py: 0.35 },
        { px: 0.35, py: 0.65 },
        { px: 0.7, py: 0.8 },
        { px: 0.5, py: 0.45 },
      ];

      coresPhysics.current.forEach((core, i) => {
        core.anchorX = width * anchors[i].px;
        core.anchorY = height * anchors[i].py;
        if (core.x === 0 && core.y === 0) {
          core.x = core.anchorX;
          core.y = core.anchorY;
        }
      });
    };
    updateAnchors();
    window.addEventListener('resize', updateAnchors);
    return () => window.removeEventListener('resize', updateAnchors);
  }, []);

  /* ── Smooth cursor tracking ── */
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const animateFollower = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
    }

    // --- Toolset Physics ---
    const time = Date.now() * 0.001;
    let toolsetMx = -9999;
    let toolsetMy = -9999;
    if (toolsetContainerRef.current) {
      const rect = toolsetContainerRef.current.getBoundingClientRect();
      toolsetMx = mousePos.current.x - rect.left;
      toolsetMy = mousePos.current.y - rect.top;
    }

    const tension = 0.04;
    const friction = 0.85;
    const repulsionRadius = 300;
    const repulsionForce = 1200;

    coresPhysics.current.forEach((core) => {
      // Ambient Drift
      const driftX = Math.sin(time + core.phaseX) * 15;
      const driftY = Math.cos(time + core.phaseY) * 15;

      const targetX = core.anchorX + driftX;
      const targetY = core.anchorY + driftY;

      let repX = 0;
      let repY = 0;
      let rotateX = 0;
      let rotateY = 0;

      const dx = toolsetMx - core.x;
      const dy = toolsetMy - core.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Cursor Repulsion
      if (dist < repulsionRadius) {
        const force = (repulsionRadius - dist) / repulsionRadius;
        repX = -(dx / dist) * force * repulsionForce * 0.1;
        repY = -(dy / dist) * force * repulsionForce * 0.1;

        rotateY = gsap.utils.clamp(-35, 35, (dx / dist) * force * -45);
        rotateX = gsap.utils.clamp(-35, 35, (dy / dist) * force * 45);
      }

      // Spring physics
      core.vx += (targetX + repX - core.x) * tension;
      core.vy += (targetY + repY - core.y) * tension;

      core.vx *= friction;
      core.vy *= friction;

      core.x += core.vx;
      core.y += core.vy;

      if (core.ref.current) {
        core.ref.current.style.transform = `translate3d(${core.x}px, ${core.y}px, 0) translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });

    // Dynamic SVG Beziers
    if (svgPathsRef.current.length > 0) {
      for (let i = 0; i < numCores - 1; i++) {
        const c1 = coresPhysics.current[i];
        const c2 = coresPhysics.current[i + 1];
        if (svgPathsRef.current[i]) {
          const cx1 = c1.x + (c2.x - c1.x) * 0.5;
          const cy1 = c1.y;
          const cx2 = c1.x + (c2.x - c1.x) * 0.5;
          const cy2 = c2.y;
          svgPathsRef.current[i]!.setAttribute('d', `M${c1.x},${c1.y} C${cx1},${cy1} ${cx2},${cy2} ${c2.x},${c2.y}`);
        }
      }
      // Loop back to first
      const first = coresPhysics.current[0];
      const last = coresPhysics.current[numCores - 1];
      if (svgPathsRef.current[numCores - 1]) {
        const cx1 = last.x + (first.x - last.x) * 0.5;
        const cy1 = last.y;
        const cx2 = last.x + (first.x - last.x) * 0.5;
        const cy2 = first.y;
        svgPathsRef.current[numCores - 1]!.setAttribute('d', `M${last.x},${last.y} C${cx1},${cy1} ${cx2},${cy2} ${first.x},${first.y}`);
      }
    }

    rafId.current = requestAnimationFrame(animateFollower);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea')) {
        if (cursorRef.current) cursorRef.current.classList.add('hidden-cursor');
      } else if (target.closest('a, button, select, [role="button"]')) {
        if (cursorRef.current) cursorRef.current.classList.add('expanded');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea')) {
        if (cursorRef.current) cursorRef.current.classList.remove('hidden-cursor');
      } else if (target.closest('a, button, select, [role="button"]')) {
        if (cursorRef.current) cursorRef.current.classList.remove('expanded');
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    rafId.current = requestAnimationFrame(animateFollower);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(rafId.current);
    };
  }, [animateFollower]);


  /* ── GSAP entrance animations ── */
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-name-line", {
        y: 200,
        opacity: 0,
        duration: 1.6,
        stagger: 0.2,
      });

      tl.from(
        ".hero-role",
        {
          y: 60,
          opacity: 0,
          duration: 1,
        },
        "-=1"
      );

      tl.from(
        ".hero-bio-word",
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.02,
        },
        "-=0.6"
      );

      tl.from(
        ".nav-item",
        {
          x: -20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
        },
        "-=1.5"
      );

      tl.from(
        ".fragment-text",
        {
          opacity: 0,
          scale: 0.9,
          duration: 1.2,
          stagger: 0.2,
        },
        "-=1.5"
      );

      tl.from(
        ".toolset-core-item-physics",
        {
          x: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.8"
      );

      tl.from(
        ".hero-cta",
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.5"
      );

      // Scroll-tied video playback
      if (videoRef.current) {
        const video = videoRef.current;

        // Attempt to play immediately on mount
        video.play().catch((err) => console.log("Autoplay blocked:", err));

        const createVideoTrigger = () => {
          ScrollTrigger.create({
            trigger: ".hero-video-container",
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => video.play(),
            onLeave: () => video.pause(),
            onEnterBack: () => video.play(),
            onLeaveBack: () => video.pause(),
          });
        };

        if (video.readyState >= 2) {
          createVideoTrigger();
        } else {
          video.onloadedmetadata = createVideoTrigger;
        }
      }

      // Background morphing for Projects section
      if (worksRef.current) {
        ScrollTrigger.create({
          trigger: worksRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleClass: "is-dark",
        });
      }
    }, containerRef); // Scoped to containerRef

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  /* ── Hover handlers for CV Dossier Card ── */
  const cvBgRef = useRef<HTMLDivElement>(null);
  const cvTextWrapRef = useRef<HTMLDivElement>(null);

  const handleCvDossierMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cvButtonRef.current || !cvTextWrapRef.current) return;
    const { left, top, width, height } = cvButtonRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.05; // Very subtle parallax
    const y = (e.clientY - (top + height / 2)) * 0.1;

    gsap.to(cvTextWrapRef.current, {
      x,
      y,
      duration: 0.8,
      ease: "power3.out",
    });

    if (cursorRef.current) cursorRef.current.classList.add("download");
  };

  const handleCvDossierEnter = () => {
    if (cvBgRef.current) {
      gsap.to(cvBgRef.current, { scaleY: 1, duration: 0.5, ease: "expo.out" });
    }
  };

  const handleCvDossierLeave = () => {
    if (cvBgRef.current) {
      gsap.to(cvBgRef.current, { scaleY: 0, duration: 0.5, ease: "expo.inOut" });
    }
    if (cvTextWrapRef.current) {
      gsap.to(cvTextWrapRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    }
    if (cursorRef.current) cursorRef.current.classList.remove("download");
  };

  /* ── Bio text word splitting for staggered animation ── */
  const bioText =
    "Graphic Designer with a Bachelor's degree in Multimedia & Animation and professional experience in branding, social media, print, and digital design. Passionate about creativity and transforming ideas into impactful visual solutions that strengthen brand identity, engage audiences, and leave a lasting impression.";
  const bioWords = bioText.split(" ");

  return (
    <div ref={containerRef} className="relative">
      {/* ── Custom Cursor ── */}
      <div ref={cursorRef} className="custom-cursor hidden md:block" />

      {/* ════════════════════════════════════════════
          SECTION 1 — HERO
          ════════════════════════════════════════════ */}
      <section className="section-brutal min-h-screen flex flex-col justify-between relative overflow-hidden hero-dark">
        {/* ── HERO VIDEO ── */}
        <div className="hero-video-container">
          <video
            ref={videoRef}
            src="/including_different_icons_also.mp4"
            className="hero-video"
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
            aria-hidden="true"
          />
        </div>
        {/* Navigation — stacked left */}
        <nav className="flex flex-col gap-2 absolute top-8 left-8 md:left-12 z-30">
          <a href="#works" className="nav-link nav-item hover:text-[#c8956c] transition-colors">Works</a>
          <a href="#info" className="nav-link nav-item hover:text-[#c8956c] transition-colors">Info</a>
          <a href="#contact" className="nav-link nav-item hover:text-[#c8956c] transition-colors">Contact</a>
          <a href="/Kiran_Kushal_CV.pdf" download className="nav-link nav-item flex items-center gap-1 text-[#c8956c] opacity-80 hover:opacity-100 transition-opacity mt-1">
            Resume <ArrowUpRight size={12} />
          </a>
        </nav>


        {/* Fragment decorative text — scattered */}
        <div className="fragment-text display-fragment absolute top-[6%] right-[-3%] select-none" aria-hidden="true">
          CREA<span className="text-[var(--color-magenta)] opacity-60">TIVE</span>
        </div>
        <div className="fragment-text display-fragment absolute bottom-[35%] right-[2%] select-none" style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }} aria-hidden="true">
          VISUAL<br />IDENTITY
        </div>
        <div className="fragment-text absolute top-[40%] left-[25%] select-none" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 7vw, 7rem)", opacity: 0.04, letterSpacing: "-0.03em" }} aria-hidden="true">
          DESIGN
        </div>



        {/* ── HERO CONTENT ── */}
        <div className="flex flex-col flex-grow relative z-20 mt-20 md:mt-0 pt-16 md:pt-24">
          {/* Name — massive, bleeds off edges */}
          <div className="overflow-hidden bleed-left mb-4 md:mb-6">
            <h1 className="hero-name-line display-massive uppercase">
              Sunaina.
            </h1>
          </div>



          {/* Role tag */}
          <div className="overflow-hidden bleed-left mb-8 md:mb-12">
            <p
              className="hero-role text-lg md:text-2xl uppercase tracking-[0.35em]"
              style={{ fontFamily: "var(--font-body)", color: "var(--color-ink-light)" }}
            >
              Graphic Designer
            </p>
          </div>

          {/* Bio — tight asymmetric editorial column */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <div className="hero-bio-column md:ml-[8vw]">
              {bioWords.map((word, i) => (
                <span key={i} className="hero-bio-word inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}
            </div>

            {/* Small decorative pull-quote */}
            <div className="hidden md:block max-w-[20ch] ml-auto mr-[5vw]" style={{ marginTop: "2rem" }}>
              <p
                className="hero-bio-word text-2xl md:text-3xl leading-[1.1] tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)", opacity: 0.15 }}
              >
                Ideas into impact.
              </p>
            </div>
          </div>
        </div>

        {/* CTA — bottom */}
        <div className="flex items-end justify-between relative z-20 pb-4 mt-8">
          <a
            href="#works"
            className="hero-cta cmyk-shift inline-block text-lg md:text-xl uppercase tracking-widest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            View Projects →
          </a>
          <span
            className="hero-cta text-xs tracking-[0.2em] uppercase hidden md:block"
            style={{ color: "var(--color-ink-faint)", fontFamily: "var(--font-body)" }}
          >
            Scroll to discover
          </span>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 1.5 — CREATIVE TOOLSET (PHYSICS)
          ════════════════════════════════════════════ */}
      <section className="creative-toolset" ref={toolsetContainerRef}>
        {/* Dynamic Light Trails */}
        <div className="toolset-trails">
          <svg style={{ width: '100%', height: '100%' }} aria-hidden="true">
            <defs>
              <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c8956c" stopOpacity="0.1" />
                <stop offset="30%" stopColor="#d4a843" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#c8956c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a07850" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Dynamic Paths */}
            {coresPhysics.current.map((_, i) => (
              <path
                key={`path-${i}`}
                ref={el => { svgPathsRef.current[i] = el; }}
                className="trail-path-dynamic"
                fill="none"
                stroke="url(#copperGradient)"
                strokeWidth="1.5"
                opacity="0.6"
              />
            ))}
          </svg>
        </div>

        <div className="toolset-inner" style={{ pointerEvents: 'none' }}>
          {/* Title */}
          <h2 className="toolset-title" style={{ position: 'relative', zIndex: 10 }}>Creative Toolset</h2>

          {/* Core Items Playground */}
          <div className="toolset-cores-physics">
            {TOOLSET_CORES.map((core, i) => (
              <div
                key={core.id}
                className="toolset-core-item-physics"
                ref={coresPhysics.current[i].ref}
              >
                <span className="toolset-core-number">{core.number}</span>
                <div className="toolset-icon-container">
                  {core.icon}
                </div>
                <div className="toolset-core-text flex flex-col">
                  <span className="toolset-core-title">{core.title}</span>
                  <span className="toolset-core-subtitle">{core.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CLIENT LOGO MARQUEE (TRUST SIGNAL)
          ════════════════════════════════════════════ */}
      <section className="py-8 border-y border-[var(--color-ink-faint)]/10 overflow-hidden bg-[var(--color-paper)]">
        <div className="marquee-container w-full h-[60px] md:h-[80px]" aria-hidden="true">
          <div className="marquee-content h-full opacity-60">
            {["NarrativeX Media", "Wittelsbach", "Future Kids", "Cakes & Co.", "The Park Arabian Mandi", "ABNA Group"].map((client, i) => (
              <span key={i} className="text-2xl md:text-3xl font-display uppercase tracking-widest text-[var(--color-ink-faint)] px-12 whitespace-nowrap">
                {client}
              </span>
            ))}
            {/* Duplicate for seamless infinite loop */}
            {["NarrativeX Media", "Wittelsbach", "Future Kids", "Cakes & Co.", "The Park Arabian Mandi", "ABNA Group"].map((client, i) => (
              <span key={`dup-${i}`} className="text-2xl md:text-3xl font-display uppercase tracking-widest text-[var(--color-ink-faint)] px-12 whitespace-nowrap">
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — WORKS (Project List)
          ════════════════════════════════════════════ */}
      <section id="works" className="py-24 px-8 md:px-16 bg-[#000000] text-white overflow-hidden relative" ref={worksRef}>
        <div className="mb-16 md:mb-24 relative z-10">
          <span className="text-xs tracking-[0.3em] uppercase text-white/40 font-mono">
            [ 01 // 3D STAGE ]
          </span>
          <h2 className="text-5xl md:text-7xl font-display mt-4 tracking-tight">Interactive <br /> Case Studies</h2>
        </div>

        {/* We keep the filter logic but render the 3D grid */}
        <div className="mb-16 relative z-10">
          <div className="flex flex-wrap gap-4 mt-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-xs md:text-sm tracking-widest uppercase transition-colors duration-300 font-mono ${activeCategory === category
                    ? "bg-white text-[#000000]"
                    : "bg-transparent border border-white/20 text-white/70 hover:border-white hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24 w-full relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => {
              // Determine frame style based on category
              const isMobileFrame = project.category === "Social Media" || project.category === "Packaging";
              const frameClass = isMobileFrame
                ? "aspect-[9/19] rounded-[2.5rem] md:rounded-[3rem] border-[6px] md:border-[10px] border-[#1a1a1a] shadow-[inset_0_0_20px_rgba(255,255,255,0.05),_0_30px_60px_rgba(0,0,0,0.8)]"
                : "aspect-[4/3] rounded-xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] bg-white/5 backdrop-blur-md p-2";

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  key={project.id}
                  className={`relative group cursor-none flex flex-col justify-center items-center gap-6 ${i % 2 !== 0 ? 'md:mt-24' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`View project: ${project.title}`}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
                  onMouseEnter={() => { if (cursorRef.current) cursorRef.current.classList.add("inspect") }}
                  onMouseLeave={() => { if (cursorRef.current) cursorRef.current.classList.remove("inspect") }}
                >
                  <Tilt
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    perspective={1200}
                    transitionSpeed={1000}
                    scale={1.03}
                    glareEnable={true}
                    glareMaxOpacity={0.3}
                    glareColor="#ffffff"
                    glarePosition="all"
                    className="w-full relative"
                  >
                    <div className={`relative overflow-hidden w-full ${frameClass} transform-gpu`}>
                      {/* Inner Glass border for Acrylic */}
                      {!isMobileFrame && <div className="absolute inset-0 rounded-lg border border-white/20 z-20 pointer-events-none"></div>}

                      {project.posterAsset && (
                        <img
                          src={project.posterAsset}
                          alt={project.title}
                          className={`w-full h-full object-cover ${!isMobileFrame && "rounded-lg"}`}
                        />
                      )}

                      {/* Dark overlay that fades on hover */}
                      <div className="absolute inset-0 bg-[#000000]/40 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
                    </div>
                  </Tilt>

                  {/* Minimalist Info Tag (Fades out on hover) */}
                  <div className="flex w-full justify-between items-end px-2 opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                    <h3 className="text-xl md:text-2xl font-display text-white/90 leading-tight">{project.title}</h3>
                    <span className="text-xs font-mono text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — INFO / ABOUT
          ════════════════════════════════════════════ */}
      <section id="info" className="section-brutal">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Left — pull quote */}
          <div className="md:col-span-5">
            <h2 className="display-large cmyk-shift leading-[0.85] mb-8">About</h2>
            <blockquote
              className="text-3xl md:text-5xl leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              &ldquo;Design is not what it looks like. Design is how the ink
              bleeds into the paper.&rdquo;
            </blockquote>
          </div>

          {/* Right — experience */}
          <div className="md:col-span-6 md:col-start-7">
            <span className="text-xs tracking-[0.3em] uppercase block mb-8" style={{ color: "var(--color-ink-faint)", fontFamily: "var(--font-body)" }}>
              Experience
            </span>

            {experiences.map((exp) => (
              <div key={exp.id} className="experience-item">
                <h3 className="text-xl md:text-2xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {exp.company}
                </h3>
                <p className="text-sm mb-1" style={{ color: "var(--color-ink-light)" }}>
                  {exp.role} · {exp.duration}
                </p>
                {exp.description.map((desc, j) => (
                  <p key={j} className="text-sm" style={{ color: "var(--color-ink-faint)" }}>
                    {desc}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4 — CONTACT
          ════════════════════════════════════════════ */}
      <section id="contact" className="section-brutal flex flex-col items-center">
        <span className="text-xs tracking-[0.3em] uppercase block mb-12 text-[var(--color-ink-faint)] font-mono text-center">
          Get In Touch
        </span>

        <ContactForm />

        <div className="flex justify-center gap-8 mt-24">
          <a href="#" aria-label="Visit Behance profile (link not yet configured)" className="nav-link inline-block cmyk-shift">Behance</a>
          <a href="#" aria-label="Visit LinkedIn profile (link not yet configured)" className="nav-link inline-block cmyk-shift">LinkedIn</a>
          <a href="#" aria-label="Visit Dribbble profile (link not yet configured)" className="nav-link inline-block cmyk-shift">Dribbble</a>
          <a href="#" aria-label="Visit Instagram profile (link not yet configured)" className="nav-link inline-block cmyk-shift">Instagram</a>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CV DOWNLOAD SECTION (Brutalist Dossier)
          ════════════════════════════════════════════ */}
      <section className="px-4 py-8 md:py-16 max-w-[1200px] mx-auto w-full">
        <a
          ref={cvButtonRef}
          href="/Sunaina_CV.pdf"
          download
          className="cv-dossier-card group"
          onMouseMove={handleCvDossierMove}
          onMouseEnter={handleCvDossierEnter}
          onMouseLeave={handleCvDossierLeave}
        >
          {/* Animated Background Fill */}
          <div ref={cvBgRef} className="cv-dossier-bg"></div>

          <div ref={cvTextWrapRef} className="cv-dossier-content flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            {/* Left side: brutalist meta info */}
            <div className="flex flex-col gap-2 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] cv-dossier-meta">
              <span>[ IDENTIFICATION ]</span>
              <span>FILE: SUNAINA_CV.PDF</span>
              <span>CLEARANCE: UNRESTRICTED</span>
              <span>STATUS: READY FOR EXTRACTION</span>
            </div>

            {/* Right side: Elegant Title */}
            <div className="text-left md:text-right">
              <h2 className="cv-dossier-title">
                EXTRACT<br />DOSSIER
              </h2>
              <div className="mt-6 flex items-center justify-start md:justify-end gap-4 text-xs tracking-widest cv-dossier-cta">
                <span className="w-16 h-[1px] bg-current"></span>
                INITIATE TRANSFER
              </div>
            </div>
          </div>
        </a>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER — Marquee Ticker
          ════════════════════════════════════════════ */}
      <footer className="marquee-container" aria-label="Site footer">
        <div className="marquee-content" aria-hidden="true">
          <span>© 2024 SUNAINA</span>
          <span>//</span>
          <span>GRAPHIC DESIGNER</span>
          <span>//</span>
          <span>BRANDING</span>
          <span>//</span>
          <span>SOCIAL MEDIA</span>
          <span>//</span>
          <span>PRINT DESIGN</span>
          <span>//</span>
          <span>EDITORIAL</span>
          <span>//</span>
          {/* Duplicate for seamless loop */}
          <span>© 2024 SUNAINA</span>
          <span>//</span>
          <span>GRAPHIC DESIGNER</span>
          <span>//</span>
          <span>BRANDING</span>
          <span>//</span>
          <span>SOCIAL MEDIA</span>
          <span>//</span>
          <span>PRINT DESIGN</span>
          <span>//</span>
          <span>EDITORIAL</span>
          <span>//</span>
        </div>
      </footer>

      {/* ── Visual-First Full-Screen Modal Overlay ── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/95 backdrop-blur-xl cursor-auto"
            onClick={() => {
              setSelectedProject(null);
              setIsDrawerOpen(false);
            }}
          >
            {/* Full Screen Image Focus */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="absolute inset-4 md:inset-12 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedProject.posterAsset && (
                <img
                  src={selectedProject.posterAsset}
                  alt={selectedProject.title}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,1)]"
                />
              )}
            </motion.div>

            {/* Floating Top Controls */}
            <div className="absolute top-6 right-6 md:top-12 md:right-12 z-20 flex gap-4" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="px-6 py-3 flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors duration-300 font-mono text-xs uppercase tracking-widest border border-white/10"
              >
                {isDrawerOpen ? "Hide Info" : "Info"}
              </button>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setIsDrawerOpen(false);
                }}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors duration-300 border border-white/10"
                aria-label="Close project details"
              >
                ✕
              </button>
            </div>

            {/* Collapsible Side Drawer (Right) */}
            <AnimatePresence>
              {isDrawerOpen && (
                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute right-0 top-0 bottom-0 w-full md:w-[450px] bg-[#030303]/90 backdrop-blur-2xl border-l border-white/10 p-8 md:p-12 flex flex-col z-30 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-xs font-mono tracking-widest uppercase text-white/50 mb-2 block">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-3xl font-display mb-4 leading-tight text-white">
                    {selectedProject.title}
                  </h3>

                  <div className="flex gap-4 mb-8">
                    <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
                      <span>👁</span>
                      <span>{projectStats.views} Views</span>
                    </div>
                    <button
                      onClick={handleLike}
                      aria-label={`Like this project (${projectStats.likes} likes)`}
                      className={`flex items-center gap-2 text-xs font-mono transition-colors ${hasLiked ? 'text-[#c8956c]' : 'text-white/50 hover:text-white/80'}`}
                    >
                      <span>♥</span>
                      <span>{projectStats.likes} Likes</span>
                    </button>
                  </div>

                  {/* Tabs Header */}
                  <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto">
                    {["Overview", "Metrics"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setModalTab(tab as any)}
                        className={`pb-2 text-xs whitespace-nowrap transition-colors duration-300 font-mono uppercase tracking-widest border-b-2 ${modalTab === tab
                            ? "border-white text-white"
                            : "border-transparent text-white/40 hover:text-white/80"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tabs Content */}
                  <div className="flex-1 mb-8">
                    {modalTab === "Overview" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-sm font-body text-white/70 leading-relaxed whitespace-pre-wrap">
                          {selectedProject.content}
                        </p>
                      </motion.div>
                    )}
                    {modalTab === "Metrics" && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <ul className="space-y-4">
                          {selectedProject.metrics.map((metric, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-[#c8956c] font-mono mt-1">✓</span>
                              <span className="text-sm font-body text-white/70 leading-relaxed">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>

                  {/* CTA */}
                  <a
                    href="#contact"
                    onClick={() => {
                      setSelectedProject(null);
                      setIsDrawerOpen(false);
                    }}
                    className="mt-auto flex items-center justify-between px-6 py-4 bg-white text-black hover:bg-white/80 rounded-lg transition-colors duration-300 font-mono text-xs tracking-widest uppercase w-full"
                  >
                    Inquire
                    <ArrowUpRight size={16} />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cmd+K Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-[10vh]"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono"
              onClick={(e) => e.stopPropagation()}
            >
              <Command className="w-full h-full flex flex-col" shouldFilter={false}>
                <div className="flex items-center border-b border-white/10 px-4">
                  <span className="text-white/50 text-xl mr-3">⌕</span>
                  <Command.Input
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    placeholder="Search projects, categories, clients..."
                    className="w-full bg-transparent border-none outline-none py-6 text-lg text-white placeholder:text-white/30"
                    autoFocus
                  />
                  <div className="text-white/30 text-xs px-2 py-1 border border-white/10 rounded">ESC</div>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                  <Command.Empty className="py-12 text-center text-white/50 text-sm">
                    {searchQuery ? "No results found." : "Start typing to search..."}
                  </Command.Empty>

                  {searchResults.map((project) => (
                    <Command.Item
                      key={project.id}
                      value={project.title}
                      onSelect={() => {
                        setSelectedProject(project);
                        setIsDrawerOpen(true);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors aria-selected:bg-white/10 text-white"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded overflow-hidden flex-shrink-0">
                        {project.posterAsset && (
                          project.posterAsset.endsWith('.mp4') || project.posterAsset.endsWith('.webm') ? (
                            <video src={project.posterAsset} aria-label={project.title} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                          ) : (
                            <img src={project.posterAsset} alt={project.title} className="w-full h-full object-cover" />
                          )
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{project.title}</span>
                        <span className="text-xs text-white/50">{project.category} // {project.client}</span>
                      </div>
                    </Command.Item>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
