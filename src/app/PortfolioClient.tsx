"use client";

import { useEffect, useRef, useState, useCallback, createRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Command } from "cmdk";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, X, Search } from "lucide-react";
import ContactForm from "./ContactForm";
import { PROJECTS } from "@/data/projects";

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
  industry?: string;
  featured?: boolean;
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
            <stop offset="0%" stopColor="#B4232F" />
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
        <rect x="6" y="6" width="44" height="44" rx="6" fill="none" stroke="#B4232F" strokeWidth="0.5" opacity="0.4" />
        {/* Ps text */}
        <text x="10" y="39" fontFamily="serif" fontSize="26" fontWeight="600" fill="#5cc8e8" opacity="0.9">Ps</text>
        {/* Copper accent corner */}
        <circle cx="44" cy="12" r="2" fill="#B4232F" opacity="0.3" />
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
            <stop offset="50%" stopColor="#B4232F" />
            <stop offset="100%" stopColor="#B4232F" />
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
            <stop offset="30%" stopColor="#B4232F" />
            <stop offset="70%" stopColor="#a07850" />
            <stop offset="100%" stopColor="#d4a843" />
          </linearGradient>
          <linearGradient id="brassTop" x1="8" y1="4" x2="48" y2="8">
            <stop offset="0%" stopColor="#e8c88a" />
            <stop offset="100%" stopColor="#B4232F" />
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
            <stop offset="50%" stopColor="#B4232F" />
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

/* ───────────── Portfolio helpers ───────────── */

const PAGE_SIZE = 12;

/** Large mockups that rotate in the intro panel (first thing seen after the hero) */
const INTRO_MOCKUPS = [
  "/projects/light-lens-cards.jpg",
  "/projects/glambank-stationery.jpg",
  "/projects/street-shades-logo.jpg",
  "/projects/bk-birla-brochure.jpg",
  "/projects/pasidi-cards.jpg",
  "/projects/andrew-logo.jpg",
];

/** Vertical social posts shown inside the phone mockup */
const PHONE_POSTS = [
  "/projects/pakka-telangana-promise.jpg",
  "/projects/starlifts-villa.jpg",
  "/projects/telangana-dhaba-reel.jpg",
  "/projects/abna-secure.jpg",
  "/projects/pakka-telangana-nalli.jpg",
  "/projects/wittelsbach-cpa-cac.jpg",
];

/** Paste the full Instagram profile URL here to show the Instagram icon in the contact card and footer */
const INSTAGRAM_URL = "";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Public contact address shown in the contact section */
const CONTACT_EMAIL = "sunainanalla419@gmail.com";

/** Labels used for self-initiated work — excluded from client counts and the client list */
const NON_CLIENTS = ["Concept", "Personal"];

const SERVICES = [
  { category: "Branding", title: "Brand Identity", text: "Logos, monograms, business cards, stationery and signage that make a business instantly recognisable." },
  { category: "Social Media", title: "Social Media Creatives", text: "Scroll-stopping posts, reel covers, festive creatives and campaign series in a consistent brand voice." },
  { category: "Print", title: "Print & Advertising", text: "Menus, flyers, brochures, banners, backdrops and vehicle branding, delivered print-ready." },
  { category: "Packaging", title: "Packaging", text: "Labels, boxes, bags and product cartons that look premium on the shelf and in photos." },
  { category: "Illustration", title: "Illustration", text: "Characters, sticker sets and custom illustrations that give a brand its own personality." },
];

const PROCESS = [
  { step: "01", title: "Brief", text: "Tell me about your business, your audience and what you need — through the form, a call or a message." },
  { step: "02", title: "Concepts", text: "I explore directions and share initial designs with the thinking behind each one." },
  { step: "03", title: "Refine", text: "We review together and refine the chosen direction until it feels right." },
  { step: "04", title: "Deliver", text: "You receive final files ready for print, social and web, in every format you need." },
];


const isVideoAsset = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

function ProjectMedia({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (!src) return null;
  if (isVideoAsset(src)) {
    return <video src={src} aria-label={alt} className={className} autoPlay muted loop playsInline preload="metadata" />;
  }
  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
}

/* ───────────── Fallback Data ───────────── */

const MOCK_PROJECTS: Project[] = PROJECTS.map((p, i) => ({ id: String(i + 1), ...p }));

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

  const [activeIndustry, setActiveIndustry] = useState<string>("All");
  const industries = Array.from(new Set(projects.map((p) => p.industry).filter(Boolean) as string[]))
    .sort((a, b) => {
      const last = (x: string) => (x === "Personal & Concept" ? 1 : 0);
      const n = (x: string) => projects.filter((p) => p.industry === x).length;
      return last(a) - last(b) || n(b) - n(a);
    });

  const filteredProjects = projects.filter((p) => {
    return (activeCategory === "All" || p.category === activeCategory)
      && (activeIndustry === "All" || p.industry === activeIndustry);
  });

  // Hand-picked highlights; falls back to the first six if none are flagged (e.g. older DB rows)
  const flagged = projects.filter((p) => p.featured);
  const featuredProjects = (flagged.length ? flagged : projects).slice(0, 6);
  // Hero reel: a broad sample of the work, so visitors see real pieces in the first screen
  const reelProjects = projects.filter((p) => !isVideoAsset(p.posterAsset)).slice(0, 16);
  const clientNames = Array.from(new Set(projects.map((p) => p.client))).filter((c) => !NON_CLIENTS.includes(c));

  /** Jump to the full grid with a discipline pre-selected (used by Services + hero) */
  const openWork = (category: string = "All") => {
    setActiveCategory(category);
    setActiveIndustry("All");
    setVisibleCount(PAGE_SIZE);
    requestAnimationFrame(() => document.getElementById("all-work")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  /* ── Portfolio layout state ── */
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleProjects = filteredProjects.slice(0, visibleCount);

  // Prev / next within the current filter, so the viewer works like a gallery
  const selectedIndex = selectedProject ? filteredProjects.findIndex((p) => p.id === selectedProject.id) : -1;
  const stepProject = (dir: 1 | -1) => {
    if (selectedIndex < 0 || filteredProjects.length < 2) return;
    const next = filteredProjects[(selectedIndex + dir + filteredProjects.length) % filteredProjects.length];
    setSelectedProject(next);
  };
  // Keyboard handler reads the latest stepProject through a ref, so the listener isn't re-bound every render
  const stepRef = useRef(stepProject);
  useEffect(() => { stepRef.current = stepProject; });

  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") stepRef.current(1);
      else if (e.key === "ArrowLeft") stepRef.current(-1);
      else if (e.key === "Escape") { setSelectedProject(null); setIsDrawerOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [selectedProject]);

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
      gsap.from(".hero-line", { y: 40, opacity: 0, duration: 1.1, stagger: 0.15, ease: "power3.out", delay: 0.15 });

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

      // Hero → intro transition: the hero pins in place and the cream intro sheet slides up over it
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = document.getElementById("intro");
        if (!intro) return;
        ScrollTrigger.create({
          trigger: ".hero-stage",
          start: "bottom bottom",
          endTrigger: intro,
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(".hero-dim", {
          opacity: 0.6,
          ease: "none",
          scrollTrigger: { trigger: intro, start: "top bottom", end: "top top", scrub: true },
        });
        // Phone drifts up a little as the intro scrolls (parallax)
        gsap.fromTo(".intro-phone", { y: 60 }, {
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: intro, start: "top bottom", end: "bottom top", scrub: true },
        });
        // About image parallax (desktop)
        gsap.fromTo(".about-parallax", { yPercent: -6 }, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: "#info", start: "top bottom", end: "bottom top", scrub: true },
        });
        // Work section rises in
        if (worksRef.current) {
          gsap.from("#works > *", {
            y: 50,
            opacity: 0,
            ease: "none",
            stagger: 0.04,
            scrollTrigger: { trigger: worksRef.current, start: "top 90%", end: "top 30%", scrub: 0.6 },
          });
        }
      });
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
    "Branding, social media, print and packaging design for restaurants, schools, real estate and growing businesses — designed to get noticed and remembered.";
  const bioWords = bioText.split(" ");

  /* ── Page chrome & showcase state ── */
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [introSlide, setIntroSlide] = useState(0);
  const [phoneSlide, setPhoneSlide] = useState(0);
  const [activeService, setActiveService] = useState(0);

  const findByAsset = (asset: string) => projects.find((p) => p.posterAsset === asset);
  const introProjects = INTRO_MOCKUPS.map(findByAsset).filter(Boolean) as Project[];
  const phoneProjects = PHONE_POSTS.map(findByAsset).filter(Boolean) as Project[];
  const contactThumbs = featuredProjects.slice(0, 4);
  const serviceExample = (category: string) =>
    projects.find((p) => p.category === category && p.featured) || projects.find((p) => p.category === category);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIntroSlide((i) => i + 1);
      setPhoneSlide((i) => i + 1);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const intro = document.getElementById("intro");
      setPastHero(!!intro && intro.getBoundingClientRect().top <= 72);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#works", label: "Work" },
    { href: "#services", label: "Services" },
    { href: "#info", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* ── Custom Cursor ── */}
      <div ref={cursorRef} className="custom-cursor hidden md:block" />

      {/* ════════════════════════════════════════════
          HEADER — fixed; light over the hero, crimson over cream
          ════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 inset-x-0 z-[60] transition-colors duration-500 ${pastHero ? "bg-paper/85 backdrop-blur-md text-crimson" : "text-[#F3EADF]"}`}
      >
        <div className="flex items-center justify-between px-5 md:px-10 h-16">
          <a href="#top" className="text-sm md:text-base font-semibold tracking-[0.35em] uppercase" aria-label="Sunaina — home">
            Sunaina
          </a>
          <nav aria-label="Main" className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="opacity-80 hover:opacity-100 transition-opacity">{l.label}</a>
            ))}
            <a href="/Sunaina_CV.pdf" download="Sunaina_Nalla_CV.pdf" className="opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-1">
              Resume <ArrowUpRight size={13} />
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className={`px-4 py-2 text-xs font-medium tracking-wide rounded-[3px] transition-colors ${pastHero ? "bg-crimson text-paper hover:bg-ink" : "bg-[#F3EADF] text-ink hover:bg-white"}`}
            >
              Get in touch
            </a>
            <button
              type="button"
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={`block w-5 h-[1.5px] bg-current transition-transform ${menuOpen ? "translate-y-[3.25px] rotate-45" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-current transition-transform ${menuOpen ? "-translate-y-[3.25px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-paper text-crimson flex flex-col justify-center px-8 md:hidden"
          >
            {[...navLinks, { href: "/Sunaina_CV.pdf", label: "Resume" }].map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className="text-5xl py-2 font-display"
                {...(l.href.endsWith(".pdf") ? { download: "Sunaina_Nalla_CV.pdf" } : {})}
              >
                {l.label}
              </motion.a>
            ))}
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-10 text-sm text-ink/70">{CONTACT_EMAIL}</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════
          1 — HERO (pins while the next section slides over it)
          ════════════════════════════════════════════ */}
      <div id="top" className="hero-stage bg-[var(--color-cocoa-deep)]">
        <section className="hero-section relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden text-[#F3EADF] px-6">
          <div className="hero-video-container absolute inset-0">
            <video
              ref={videoRef}
              src="/including_different_icons_also.mp4"
              className="w-full h-full object-cover object-[50%_20%]"
              muted
              playsInline
              loop
              autoPlay
              preload="metadata"
              aria-hidden="true"
            />
            {/* Warm cocoa grade so the footage reads as one moody, brown frame */}
            <div className="absolute inset-0 bg-[#5A2A1C] mix-blend-multiply opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1F0E0A]/50 via-[#1F0E0A]/20 to-[#1F0E0A]/85" />
          </div>
          <div className="hero-dim absolute inset-0 z-[40] bg-black opacity-0 pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 flex flex-col items-center mt-[22vh] md:mt-[26vh]">
            <h1 className="hero-line font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight">
              Hi, I&apos;m Sunaina
            </h1>
            <p className="hero-line mt-5 max-w-[46ch] text-sm md:text-base leading-relaxed text-[#F3EADF]/85">
              A graphic designer creating brand identities, social media, print and packaging for restaurants, schools, real estate and growing businesses.
            </p>
            <div className="hero-line mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#works" className="cta-solid inline-flex items-center gap-3 px-5 py-2.5 bg-[#F3EADF] text-ink text-xs font-medium rounded-[3px] hover:bg-white transition-colors">
                View my work <span aria-hidden="true">↓</span>
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#F3EADF]/40 text-xs font-medium rounded-[3px] hover:border-[#F3EADF] transition-colors">
                Start a project
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════
          2 — INTRO (the sheet that slides over the hero): rotating work + phone feed
          ════════════════════════════════════════════ */}
      <section id="intro" className="relative z-20 bg-paper text-crimson shadow-[0_-30px_80px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-1 md:grid-cols-[45%_1fr] min-h-[100svh]">
          {/* Left: rotating large mockups */}
          <div className="relative min-h-[60vh] md:min-h-full overflow-hidden bg-ink">
            <AnimatePresence mode="sync">
              {introProjects.length > 0 && (() => {
                const p = introProjects[introSlide % introProjects.length];
                return (
                  <motion.button
                    type="button"
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 cursor-none"
                    aria-label={`View project: ${p.title}`}
                  >
                    <img src={p.posterAsset} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute left-5 bottom-5 md:left-8 md:bottom-8 text-left text-[#F3EADF] drop-shadow">
                      <span className="block text-[11px] uppercase tracking-[0.25em] opacity-80">{p.client}</span>
                      <span className="block font-display text-xl md:text-2xl">{p.title.split(" - ")[1] || p.title}</span>
                    </span>
                  </motion.button>
                );
              })()}
            </AnimatePresence>
            {/* Rotating badge */}
            <div className="absolute -right-12 bottom-24 md:bottom-16 w-28 h-28 md:w-32 md:h-32 text-crimson z-10 pointer-events-none hidden md:block" aria-hidden="true">
              <svg viewBox="0 0 120 120" className="w-full h-full spin-slow">
                <defs><path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
                <circle cx="60" cy="60" r="58" fill="var(--color-paper)" />
                <text fill="currentColor" fontSize="11.5" letterSpacing="3.2" fontFamily="var(--font-display)">
                  <textPath href="#badge-circle">SUNAINA · GRAPHIC DESIGNER · HYDERABAD ·</textPath>
                </text>
                <text x="60" y="66" textAnchor="middle" fill="currentColor" fontSize="20" fontFamily="var(--font-display)" fontStyle="italic">S.</text>
              </svg>
            </div>
          </div>

          {/* Right: statement + phone feed */}
          <div className="relative flex flex-col items-center justify-center px-6 md:px-16 py-20 md:py-24 text-center">
            {/* Vertical labels along the divide */}
            <div className="hidden md:flex absolute left-4 inset-y-16 flex-col justify-between items-center text-[11px] tracking-[0.2em] uppercase text-crimson/70" aria-hidden="true">
              {["Branding", "Social", "Print", "Packaging"].map((label) => (
                <span key={label} className="[writing-mode:vertical-rl] rotate-180">{label}</span>
              ))}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.15] max-w-[18ch]">
              <span className="font-body font-semibold">Design that gets</span> your business <em>noticed, remembered</em> and <span className="font-body font-semibold">chosen.</span>
            </h2>

            {/* Phone mockup cycling through social posts */}
            {phoneProjects.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedProject(phoneProjects[phoneSlide % phoneProjects.length])}
                className="intro-phone mt-12 relative w-[190px] md:w-[220px] aspect-[9/19] rounded-[2.2rem] bg-[#111] p-[7px] shadow-[0_30px_60px_rgba(42,21,16,0.35)] cursor-none"
                aria-label="View this social media project"
              >
                <span className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-black z-10" />
                <span className="block relative w-full h-full rounded-[1.8rem] overflow-hidden bg-ink">
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={phoneSlide % phoneProjects.length}
                      src={phoneProjects[phoneSlide % phoneProjects.length].posterAsset}
                      alt={phoneProjects[phoneSlide % phoneProjects.length].title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </span>
              </button>
            )}
            <p className="mt-6 text-[11px] uppercase tracking-[0.25em] text-crimson/70">Swipe-worthy social, made for your feed</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3 — STATEMENT
          ════════════════════════════════════════════ */}
      <section className="relative z-20 bg-paper text-crimson px-6 py-24 md:py-32 text-center">
        <p className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.35] max-w-[30ch] mx-auto">
          From <span className="font-body font-semibold">restaurants</span> to <span className="font-body font-semibold">schools</span>, <em>real estate</em> to <span className="font-body font-semibold">wellness</span> — I help growing businesses <em>look as good as what they do.</em>
        </p>
        <a href="#contact" className="inline-block mt-10 px-5 py-2.5 bg-crimson text-paper text-xs font-medium rounded-[3px] hover:bg-ink transition-colors">
          Get in touch
        </a>
      </section>

      <section id="works" className="py-24 md:py-32 px-4 sm:px-8 md:px-12 xl:px-16 bg-paper text-ink relative z-20 border-t border-ink/10" ref={worksRef}>
        {/* Header */}
        <div className="mb-10 md:mb-14 relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-xs text-crimson">Portfolio</span>
            <h2 className="text-5xl md:text-7xl font-display mt-4 tracking-tight leading-[0.95] text-crimson">Selected <em className="italic">work</em></h2>
          </div>
          <p className="max-w-sm text-sm text-ink/50 leading-relaxed md:text-right">
            {projects.length} projects across branding, print, packaging, social and illustration, for {new Set(projects.map((p) => p.client).filter((c) => c !== "Concept" && c !== "Personal")).size} clients.
          </p>
        </div>

        {/* Featured — hand-picked highlights shown large */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16 mb-24 md:mb-32 relative z-10">
          {featuredProjects.map((project, i) => {
            const wide = i % 4 === 0 || i % 4 === 3;
            return (
              <motion.button
                type="button"
                key={project.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`group text-left cursor-none ${wide ? "md:col-span-7" : "md:col-span-5"}`}
                aria-label={`View project: ${project.title}`}
                onClick={() => setSelectedProject(project)}
                onMouseEnter={() => cursorRef.current?.classList.add("inspect")}
                onMouseLeave={() => cursorRef.current?.classList.remove("inspect")}
              >
                <div className={`relative ${wide ? "aspect-[4/3]" : "aspect-[4/3] md:aspect-[4/5]"} rounded-md overflow-hidden bg-[radial-gradient(ellipse_at_center,_rgba(42,21,16,0.07),_rgba(42,21,16,0.03))] ring-1 ring-ink/10 flex items-center justify-center p-6 md:p-10`}>
                  <ProjectMedia
                    src={project.posterAsset}
                    alt={project.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain shadow-[0_24px_50px_rgba(42,21,16,0.28)] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 text-[11px] font-mono text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="absolute top-4 right-4 text-[11px] font-mono uppercase tracking-widest text-ink/40">Featured</span>
                </div>
                <div className="flex items-start justify-between gap-6 pt-5">
                  <div className="min-w-0">
                    <span className="block text-[11px] font-mono uppercase tracking-widest text-ink/40 mb-2">
                      {project.category}{project.industry ? ` · ${project.industry}` : ""}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display text-crimson leading-tight">{project.title}</h3>
                    <p className="text-sm text-ink/50 leading-relaxed mt-2 max-w-[52ch] line-clamp-2">{project.content}</p>
                  </div>
                  <span className="w-11 h-11 shrink-0 rounded-full border border-ink/20 flex items-center justify-center group-hover:bg-crimson group-hover:text-paper group-hover:border-crimson transition-colors">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div id="all-work" className="scroll-mt-4 flex items-end justify-between gap-6 mb-6 relative z-10">
          <h3 className="text-3xl md:text-5xl font-display tracking-tight text-crimson">All <em>projects</em></h3>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink/40">{filteredProjects.length} shown</span>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-8 md:-mx-12 xl:-mx-16 px-4 sm:px-8 md:px-12 xl:px-16 py-4 mb-8 md:mb-12 bg-paper/90 backdrop-blur-md border-b border-ink/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar -my-1 py-1" role="tablist" aria-label="Filter projects by category">
              {categories.map((category) => {
                const count = projects.filter((p) => (category === "All" || p.category === category) && (activeIndustry === "All" || p.industry === activeIndustry)).length;
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    role="tab"
                    aria-selected={active}
                    onClick={() => { setActiveCategory(category); setVisibleCount(PAGE_SIZE); }}
                    className={`shrink-0 px-4 py-2 rounded-full text-[11px] md:text-xs tracking-widest uppercase transition-colors duration-300 font-mono ${active
                      ? "bg-crimson text-paper"
                      : "border border-ink/15 text-ink/60 hover:border-ink/60 hover:text-ink"
                      }`}
                  >
                    {category}
                    <span className={`ml-2 ${active ? "text-black/50" : "text-ink/30"}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 shrink-0">
            <label className="relative">
              <span className="sr-only">Filter by industry</span>
              <select
                value={activeIndustry}
                onChange={(e) => { setActiveIndustry(e.target.value); setVisibleCount(PAGE_SIZE); }}
                className="appearance-none bg-transparent border border-ink/15 hover:border-ink/60 rounded-full pl-4 pr-9 py-2 text-[11px] md:text-xs font-mono uppercase tracking-widest text-ink/80 cursor-pointer focus:outline-none focus:border-ink"
              >
                <option value="All" className="bg-paper">All industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind} className="bg-paper">{ind} ({projects.filter((p) => p.industry === ind).length})</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/50 text-[10px]">▾</span>
            </label>
            <div className="hidden sm:flex shrink-0 rounded-full border border-ink/15 p-1" role="group" aria-label="Layout">
              {(["grid", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest transition-colors ${viewMode === mode ? "bg-ink/15 text-ink" : "text-ink/40 hover:text-ink"}`}
                >
                  {mode}
                </button>
              ))}
            </div>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          /* Masonry grid — each piece keeps its real proportions */
          <div key={activeCategory} className="columns-1 min-[480px]:columns-2 lg:columns-3 2xl:columns-4 gap-4 md:gap-6 relative z-10">
            {visibleProjects.map((project, i) => (
              <motion.button
                type="button"
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.05 }}
                className="group mb-4 md:mb-6 w-full break-inside-avoid text-left cursor-none block"
                aria-label={`View project: ${project.title}`}
                onClick={() => setSelectedProject(project)}
                onMouseEnter={() => cursorRef.current?.classList.add("inspect")}
                onMouseLeave={() => cursorRef.current?.classList.remove("inspect")}
              >
                <div className="relative overflow-hidden rounded-md bg-ink/[0.04] ring-1 ring-ink/10">
                  <ProjectMedia
                    src={project.posterAsset}
                    alt={project.title}
                    className="w-full h-auto block transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-white/80">{project.category}</span>
                    <span className="w-9 h-9 shrink-0 rounded-full bg-white text-black flex items-center justify-center">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-4 pt-3 px-0.5">
                  <h3 className="text-lg md:text-xl font-display text-ink/90 leading-snug">{project.title}</h3>
                  <span className="text-[11px] font-mono text-ink/35 shrink-0">{project.year}</span>
                </div>
                <p className="text-xs text-ink/40 px-0.5 mt-0.5">{project.client}{project.industry ? ` · ${project.industry}` : ""}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          /* Index list — scan many projects quickly */
          <ul key={activeCategory} className="relative z-10 border-t border-ink/10">
            {visibleProjects.map((project, i) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() => cursorRef.current?.classList.add("inspect")}
                  onMouseLeave={() => cursorRef.current?.classList.remove("inspect")}
                  className="group w-full grid grid-cols-[64px_1fr_auto] md:grid-cols-[40px_88px_1.4fr_1fr_140px_60px] items-center gap-4 md:gap-6 py-4 border-b border-ink/10 text-left cursor-none hover:bg-ink/[0.03] transition-colors"
                  aria-label={`View project: ${project.title}`}
                >
                  <span className="hidden md:block text-[11px] font-mono text-ink/30">{String(i + 1).padStart(2, "0")}</span>
                  <span className="block w-16 md:w-[88px] aspect-[4/3] overflow-hidden rounded-sm bg-ink/[0.04]">
                    <ProjectMedia src={project.posterAsset} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg md:text-2xl font-display text-ink/90 truncate group-hover:translate-x-1 transition-transform">{project.title}</span>
                    <span className="block md:hidden text-xs text-ink/40 truncate">{project.client} · {project.category}</span>
                  </span>
                  <span className="hidden md:block text-sm text-ink/50 truncate">{project.client}</span>
                  <span className="hidden md:block text-[11px] font-mono uppercase tracking-widest text-ink/40">{project.category}</span>
                  <span className="text-[11px] font-mono text-ink/35 text-right">{project.year}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-24">
            <p className="text-ink/40 font-mono text-sm mb-4">No projects match these filters yet.</p>
            <button onClick={() => { setActiveCategory("All"); setActiveIndustry("All"); }} className="text-xs font-mono uppercase tracking-widest underline underline-offset-4">Clear filters</button>
          </div>
        )}

        {/* Show more */}
        {filteredProjects.length > visibleCount && (
          <div className="flex flex-col items-center gap-3 mt-12 md:mt-16 relative z-10">
            <span className="text-[11px] font-mono text-ink/35 uppercase tracking-widest">
              Showing {visibleCount} of {filteredProjects.length}
            </span>
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="px-8 py-3 rounded-full border border-ink/25 hover:bg-crimson hover:text-paper hover:border-crimson transition-colors font-mono text-xs uppercase tracking-widest"
            >
              Show more work
            </button>
          </div>
        )}

        {/* Inquiry CTA at the end of the work */}
        <div className="mt-24 md:mt-32 pt-12 border-t border-ink/10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 relative z-10">
          <h3 className="text-4xl md:text-6xl font-display tracking-tight leading-[1.05] max-w-[16ch] text-crimson">Like what you see? <em>Let&apos;s make yours next.</em></h3>
          <a href="#contact" className="self-start md:self-auto inline-flex items-center gap-2 px-8 py-4 rounded-full bg-crimson text-paper font-mono text-xs uppercase tracking-widest hover:bg-ink transition-colors">
            Start a project <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CLIENTS — two rows drifting in opposite directions
          ════════════════════════════════════════════ */}
      <section aria-label="Clients" className="bg-paper text-crimson py-20 md:py-28 overflow-hidden">
        <p className="text-center text-sm mb-10">I&apos;ve had the pleasure of working with…</p>
        {[0, 1].map((row) => {
          const names = row === 0 ? clientNames.slice(0, Math.ceil(clientNames.length / 2)) : clientNames.slice(Math.ceil(clientNames.length / 2));
          return (
            <div key={row} className="client-row overflow-hidden py-3 md:py-4" aria-hidden={row === 1}>
              <div className={`client-track flex w-max items-center gap-12 md:gap-16 ${row === 1 ? "client-track-reverse" : ""}`}>
                {[...names, ...names].map((name, i) => (
                  <span key={`${name}-${i}`} className={`whitespace-nowrap text-2xl md:text-3xl ${i % 2 === 0 ? "font-body font-semibold tracking-tight" : "font-display italic"}`}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ════════════════════════════════════════════
          ABOUT — large image with an overlapping card
          ════════════════════════════════════════════ */}
      <section id="info" className="relative bg-paper text-ink pb-24 md:pb-32">
        <div className="relative md:h-[110vh] overflow-hidden">
          <img src="/projects/abna-stationery.jpg" alt="" className="about-parallax w-full h-[60vh] md:h-[125%] object-cover md:absolute md:inset-x-0 md:top-[-12%]" />
        </div>
        <div className="relative md:absolute md:top-[14vh] md:left-0 md:w-[min(560px,48vw)] bg-paper px-6 md:px-12 py-10 md:py-14 -mt-16 md:mt-0 mx-4 md:mx-0 shadow-[0_30px_60px_rgba(42,21,16,0.12)]">
          <span className="text-xs text-crimson">About me</span>
          <h2 className="font-display text-3xl md:text-[2.6rem] leading-[1.15] text-crimson mt-4 mb-6">
            I don&apos;t just <em>make things pretty</em> — I make them <span className="font-body font-semibold">work.</span>
          </h2>
          <p className="text-sm leading-relaxed text-ink/80 mb-4">
            I&apos;m Sunaina Nalla, a Hyderabad-based graphic designer with a B.Sc. in Multimedia &amp; Animation. I&apos;ve designed for agencies and independent brands across food &amp; hospitality, education, real estate, healthcare and fashion.
          </p>
          <p className="text-sm leading-relaxed text-ink/80 mb-8">
            Every project starts with what your customers need to feel — then I build the identity, posts and print that get them there.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/Sunaina_CV.pdf" download="Sunaina_Nalla_CV.pdf" className="px-5 py-2.5 bg-crimson text-paper text-xs font-medium rounded-[3px] hover:bg-ink transition-colors inline-flex items-center gap-2">
              Download CV <ArrowUpRight size={13} />
            </a>
            <a href="#contact" className="px-5 py-2.5 border border-ink/25 text-xs font-medium rounded-[3px] hover:border-ink transition-colors">
              Work with me
            </a>
          </div>
        </div>

        {/* Experience */}
        <div className="px-6 md:px-16 mt-20 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-10">
          <h3 className="md:col-span-4 font-display text-3xl md:text-4xl text-crimson">Experience</h3>
          <ol className="md:col-span-8 divide-y divide-ink/10 border-t border-ink/10">
            {experiences.map((exp) => (
              <li key={exp.id} className="py-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-1 sm:gap-6">
                <div>
                  <p className="font-body font-semibold text-ink">{exp.company}</p>
                  <p className="text-sm text-ink/60">{exp.role}</p>
                </div>
                <p className="text-sm text-ink/50 sm:text-right">{exp.duration}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SERVICES — numbered list with a sticky example image
          ════════════════════════════════════════════ */}
      <section id="services" className="bg-paper text-ink px-6 md:px-16 py-24 md:py-32 border-t border-ink/10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="font-display text-3xl md:text-5xl leading-[1.15] text-crimson">
            One designer, <em>every touchpoint</em> your brand needs: <span className="font-body font-semibold">done well.</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ink/70 max-w-[52ch] mx-auto">
            From the logo on your door to the post in your customer&apos;s feed, everything is designed to look like it belongs together.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="hidden md:block md:col-span-5 sticky top-24">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
              <AnimatePresence mode="sync">
                {(() => {
                  const ex = serviceExample(SERVICES[activeService].category);
                  return ex ? (
                    <motion.img
                      key={ex.id}
                      src={ex.posterAsset}
                      alt={ex.title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : null;
                })()}
              </AnimatePresence>
            </div>
          </div>
          <ol className="md:col-span-7">
            {SERVICES.map((svc, i) => {
              const count = projects.filter((p) => p.category === svc.category).length;
              const open = activeService === i;
              return (
                <li key={svc.title} className="border-b border-ink/10" onMouseEnter={() => setActiveService(i)}>
                  <button type="button" onClick={() => setActiveService(i)} aria-expanded={open} className="w-full flex items-baseline gap-6 py-5 text-left">
                    <span className="text-sm text-ink/50 tabular-nums">{String(i + 1).padStart(3, "0")}</span>
                    <span className={`text-lg md:text-xl transition-colors ${open ? "text-crimson font-medium" : "text-crimson/80"}`}>{svc.title}</span>
                  </button>
                  <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="pl-14 pb-4 text-sm leading-relaxed text-ink/70 max-w-[56ch]">{svc.text}</p>
                      {count > 0 && (
                        <button onClick={() => openWork(svc.category)} className="ml-14 mb-6 text-xs font-medium text-crimson underline underline-offset-4">
                          See {count} examples →
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Process */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS.map((step) => (
            <div key={step.step} className="border-t border-crimson/30 pt-5">
              <span className="text-sm text-crimson">{step.step}</span>
              <h3 className="font-display text-2xl text-crimson mt-1 mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink/70">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          QUOTE
          ════════════════════════════════════════════ */}
      <section className="bg-paper text-crimson px-6 py-24 md:py-32 text-center border-t border-ink/10">
        <blockquote className="font-display italic text-2xl md:text-4xl leading-[1.35] max-w-[34ch] mx-auto">
          &ldquo;Design is not what it looks like. Design is how the ink bleeds into the paper — and how it makes people feel when they see it.&rdquo;
        </blockquote>
        <p className="mt-6 text-sm">Sunaina Nalla</p>
        <p className="text-xs text-crimson/70">Graphic Designer</p>
      </section>

      {/* ════════════════════════════════════════════
          CONTACT — full-bleed image with a mint card
          ════════════════════════════════════════════ */}
      <section id="contact" className="relative overflow-hidden">
        <img src="/projects/light-lens-monogram.jpg" alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-[6px]" />
        <div className="absolute inset-0 bg-[#1F0E0A]/30" />
        <div className="relative flex justify-end px-4 md:px-0 py-16 md:py-24">
          <div
            className="w-full md:w-[min(820px,70vw)] bg-mint text-[#16393F] px-6 md:px-14 py-10 md:py-14"
            style={{ ["--color-ink" as string]: "#16393F", ["--color-ink-faint" as string]: "#2D5B57", ["--color-ink-light" as string]: "#16393F", ["--color-paper" as string]: "#7DD3A8" }}
          >
            <h2 className="font-display text-3xl md:text-5xl leading-[1.1]">
              Got a project in <em>mind?</em><br />
              <span className="font-body font-semibold">Let&apos;s make it happen.</span>
            </h2>
            <div className="mt-8 flex flex-col gap-2 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Design project enquiry")}`} className="inline-flex items-center gap-2 hover:underline underline-offset-4 w-fit">
                <MailIcon /> {CONTACT_EMAIL}
              </a>
              {INSTAGRAM_URL && (
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline underline-offset-4 w-fit">
                  <InstagramIcon /> Instagram
                </a>
              )}
              <span>Hyderabad, India · working with clients everywhere</span>
            </div>

            {/* Work thumbnails */}
            <div className="mt-8 grid grid-cols-4 gap-2 md:gap-3">
              {contactThumbs.map((p) => (
                <button key={p.id} type="button" onClick={() => setSelectedProject(p)} className="group relative aspect-square overflow-hidden bg-[#16393F]/10 cursor-none" aria-label={`View project: ${p.title}`}>
                  <img src={p.posterAsset} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 p-1.5 md:p-2 text-left text-[9px] md:text-[10px] leading-tight text-white bg-gradient-to-t from-black/70 to-transparent">{p.client}</span>
                </button>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-[#16393F]/20">
              <p className="text-sm mb-6">Or tell me about it here:</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER — deep teal
          ════════════════════════════════════════════ */}
      <footer className="bg-teal text-mint px-6 md:px-10 pt-14 pb-8" aria-label="Site footer">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-5">
            <a href="#top" className="text-lg font-semibold tracking-[0.35em] uppercase">Sunaina</a>
            <span className="w-px h-5 bg-mint/30" aria-hidden="true" />
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email Sunaina" className="hover:text-white transition-colors"><MailIcon /></a>
            {INSTAGRAM_URL && (
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Sunaina on Instagram" className="hover:text-white transition-colors"><InstagramIcon /></a>
            )}
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
            <a href="#top" className="text-mint/60 hover:text-white transition-colors">Home</a>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</a>
            ))}
            <a href="/Sunaina_CV.pdf" download="Sunaina_Nalla_CV.pdf" className="hover:text-white transition-colors">Resume</a>
          </nav>
        </div>
        <div className="mt-8 text-xs leading-relaxed">
          <p>Based in Hyderabad, India</p>
          <p>Email: <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">{CONTACT_EMAIL}</a></p>
        </div>
        <div className="mt-14 pt-5 border-t border-mint/15 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-mint/70">
          <span>© {new Date().getFullYear()} Sunaina Nalla. All rights reserved.</span>
          <a href="#top" className="hover:text-white">Back to top ↑</a>
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
              className="absolute inset-x-4 top-20 bottom-28 md:inset-x-24 md:top-12 md:bottom-32 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <ProjectMedia
                key={selectedProject.id}
                src={selectedProject.posterAsset}
                alt={selectedProject.title}
                className="max-w-full max-h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,1)]"
              />
            </motion.div>

            {/* Bottom caption + gallery navigation */}
            <div
              className="absolute bottom-4 md:bottom-8 left-4 right-4 md:left-12 md:right-12 z-20 flex items-end justify-between gap-4 pointer-events-none"
            >
              <div className="min-w-0 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <span className="block text-[11px] font-mono uppercase tracking-widest text-white/40">
                  {selectedProject.client} · {selectedProject.category} · {selectedProject.year}
                </span>
                <span className="block text-xl md:text-3xl font-display text-white truncate">{selectedProject.title}</span>
                <a
                  href="#contact"
                  onClick={() => { setSelectedProject(null); setIsDrawerOpen(false); }}
                  className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-mono uppercase tracking-widest text-[#B4232F] hover:text-white transition-colors"
                >
                  Want something like this? Let&apos;s talk <ArrowUpRight size={12} />
                </a>
              </div>
              {filteredProjects.length > 1 && selectedIndex >= 0 && (
                <div className="flex items-center gap-3 shrink-0 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <span className="hidden sm:block text-[11px] font-mono text-white/40 tabular-nums">
                    {String(selectedIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => stepProject(-1)}
                    aria-label="Previous project"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => stepProject(1)}
                    aria-label="Next project"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-colors"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

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
                      className={`flex items-center gap-2 text-xs font-mono transition-colors ${hasLiked ? 'text-[#B4232F]' : 'text-white/50 hover:text-white/80'}`}
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
                              <span className="text-[#B4232F] font-mono mt-1">✓</span>
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
