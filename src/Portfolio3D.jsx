import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════ */
const ROLES = ["React Developer", "Full-Stack Engineer", "UI Enthusiast", "Problem Solver"];

const SKILLS = [
  { icon: "⚛️", label: "React.js",        level: 90 },
  { icon: "🌐", label: "HTML5",            level: 95 },
  { icon: "🎨", label: "CSS3",             level: 88 },
  { icon: "🟨", label: "JavaScript",       level: 86 },
  { icon: "🔷", label: "TypeScript",       level: 74 },
  { icon: "🌱", label: "Spring Boot",      level: 70 },
  { icon: "🐬", label: "MySQL",            level: 80 },
  { icon: "🍃", label: "MongoDB",          level: 72 },
  { icon: "📮", label: "Postman",          level: 85 },
  { icon: "🐙", label: "Git & GitHub",     level: 88 },
  { icon: "🐳", label: "Docker",           level: 65 },
  { icon: "☁️", label: "REST APIs",        level: 87 },
];

const PROJECTS = [
  {
    num: "01", title: "E-Commerce Platform",
    tags: ["React", "Node.js"],
    desc: "Full-stack shopping platform with cart management, user auth, and payment integration.",
    backDesc: "Scalable architecture with JWT auth, Stripe payments, and real-time inventory updates.",
    demo: "#", repo: "#",
  },
  {
    num: "02", title: "Task Manager App",
    tags: ["React", "MongoDB"],
    desc: "Kanban-style productivity tool with drag-and-drop, labels, and real-time sync.",
    backDesc: "WebSocket-powered real-time collaboration with role-based access control and history.",
    demo: "#", repo: "#",
  },
  {
    num: "03", title: "Portfolio Website",
    tags: ["HTML", "CSS", "JS"],
    desc: "This very site — built with attention to motion, aesthetics, and clean code structure.",
    backDesc: "Three.js 3D animations, CSS perspective tilt cards, and custom cursor micro-interactions.",
    demo: "#", repo: "#",
  },
  {
    num: "04", title: "Weather Dashboard",
    tags: ["React", "REST API"],
    desc: "Real-time weather app with search, geolocation, and animated condition icons.",
    backDesc: "OpenWeather API with 7-day forecast, geolocation detection, and animated SVG weather art.",
    demo: "#", repo: "#",
  },
  {
    num: "05", title: "Blog CMS",
    tags: ["Node.js", "MySQL"],
    desc: "Content management system with rich text editing, categories, and SEO-friendly URLs.",
    backDesc: "Full REST API with pagination, Markdown support, image upload, and meta tag generation.",
    demo: "#", repo: "#",
  },
  {
    num: "06", title: "Dev Tools CLI",
    tags: ["TypeScript", "Docker"],
    desc: "Command-line toolkit automating dev workflows — scaffolding, linting, and deploys.",
    backDesc: "Plugin-based architecture with Docker Compose integration and CI/CD pipeline automation.",
    demo: "#", repo: "#",
  },
];

/* ════════════════════════════════════════════════════════════
   CSS
════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg: #050005;
    --red: #ff003c;
    --red-dim: rgba(255,0,60,0.15);
    --red-glow: rgba(255,0,60,0.4);
    --border: rgba(255,0,60,0.18);
    --text: #f0eaf0;
    --muted: rgba(240,234,240,0.52);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; overflow-x: hidden; cursor: none; }

  /* ── Keyframes ── */
  @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulseGlow { 0%,100%{box-shadow:0 0 10px rgba(255,0,60,.4)} 50%{box-shadow:0 0 28px rgba(255,0,60,.9)} }
  @keyframes spinRing  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes scanline  { 0%{top:-8%} 100%{top:108%} }

  /* ── Reveal ── */
  .reveal { opacity:0; transform:translateY(26px); transition:opacity .7s cubic-bezier(.23,1,.32,1),transform .7s cubic-bezier(.23,1,.32,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }

  /* ── Nav ── */
  .np-nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    display:flex; align-items:center; justify-content:space-between;
    padding:20px 80px;
    background:rgba(5,0,5,.88); backdrop-filter:blur(22px);
    border-bottom:1px solid rgba(255,0,60,.07);
    transition:padding .3s, box-shadow .3s;
  }
  .np-nav.scrolled { padding:13px 80px; box-shadow:0 4px 40px rgba(0,0,0,.45); }
  .np-nav-links { display:flex; gap:36px; list-style:none; }
  .np-nav-link {
    text-decoration:none; font-size:11px; letter-spacing:.18em; text-transform:uppercase;
    color:var(--muted); transition:color .2s; position:relative; padding-bottom:4px;
  }
  .np-nav-link::after {
    content:''; position:absolute; bottom:0; left:0; width:0; height:1px;
    background:var(--red); transition:width .3s cubic-bezier(.23,1,.32,1);
  }
  .np-nav-link.active { color:var(--red); }
  .np-nav-link.active::after { width:100%; }
  .np-logo {
    font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:.1em; color:var(--text);
  }

  /* ── Section ── */
  .np-section { position:relative; z-index:1; padding:100px 80px; width:100%; }
  .np-section-tag { font-size:10px; letter-spacing:.25em; text-transform:uppercase; color:var(--red); margin-bottom:12px; display:block; }
  .np-section-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.4rem,4vw,3.8rem); letter-spacing:.05em; line-height:1; margin-bottom:50px; }

  /* ── Divider ── */
  .np-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(255,0,60,.3),transparent); position:relative; z-index:1; }

  /* ── Buttons ── */
  .np-btn {
    display:inline-block; padding:13px 30px; border-radius:30px;
    font-family:'Outfit',sans-serif; font-size:12px; letter-spacing:.12em;
    text-transform:uppercase; cursor:none; transition:all .3s; text-decoration:none;
    position:relative; overflow:hidden;
  }
  .np-btn::after {
    content:''; position:absolute; top:50%; left:50%; width:0; height:0;
    background:rgba(255,255,255,.14); border-radius:50%;
    transform:translate(-50%,-50%); transition:width .45s,height .45s;
  }
  .np-btn:hover::after { width:220px; height:220px; }
  .np-btn-primary { background:var(--red); color:#fff; border:none; box-shadow:0 0 28px rgba(255,0,60,.45); }
  .np-btn-primary:hover { box-shadow:0 0 55px rgba(255,0,60,.8); transform:translateY(-3px); }
  .np-btn-outline { background:transparent; color:var(--text); border:1px solid var(--border); }
  .np-btn-outline:hover { border-color:var(--red); color:var(--red); transform:translateY(-3px); box-shadow:0 0 22px rgba(255,0,60,.2); }

  /* ── Contact inputs ── */
  .np-input {
    width:100%; padding:14px 18px; border-radius:12px;
    border:1px solid rgba(255,0,60,.2); background:rgba(255,255,255,.03);
    color:var(--text); outline:none; font-family:'Outfit',sans-serif; font-size:14px;
    transition:border-color .2s, box-shadow .2s;
  }
  .np-input:focus { border-color:rgba(255,0,60,.6); box-shadow:0 0 22px rgba(255,0,60,.14); }
  .np-input::placeholder { color:var(--muted); }

  /* ── 3D Flip Card ── */
  .np-flip-root { perspective:1300px; height:300px; }
  .np-flip-inner {
    position:relative; width:100%; height:100%;
    transform-style:preserve-3d;
    transition:transform .75s cubic-bezier(.23,1,.32,1);
  }
  .np-flip-root:hover .np-flip-inner { transform:rotateY(180deg); }
  .np-flip-face {
    position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden;
    border-radius:20px; padding:28px;
  }
  .np-flip-front {
    background:rgba(255,255,255,.03);
    border:1px solid rgba(255,0,60,.14);
    overflow:hidden;
  }
  .np-flip-back {
    transform:rotateY(180deg);
    background:linear-gradient(135deg,rgba(255,0,60,.14),rgba(80,0,20,.28));
    border:1px solid rgba(255,0,60,.55);
    box-shadow:0 0 50px rgba(255,0,60,.2) inset;
    display:flex; flex-direction:column; justify-content:center; align-items:center;
    text-align:center; gap:16px;
  }

  /* ── Skill card ── */
  .np-skill-card {
    border-radius:16px; padding:20px 14px;
    display:flex; flex-direction:column; align-items:center; gap:8px;
    cursor:default; transition:all .3s cubic-bezier(.23,1,.32,1);
    transform-style:preserve-3d;
    border:1px solid rgba(255,0,60,.12);
    background:rgba(255,255,255,.03);
  }
  .np-skill-card:hover {
    background:rgba(255,0,60,.08);
    border-color:rgba(255,0,60,.5);
    box-shadow:0 14px 40px rgba(255,0,60,.2);
    transform:perspective(800px) rotateX(-6deg) rotateY(4deg) translateZ(12px) scale(1.04);
  }

  /* ── Hero ── */
  .np-hero {
    position:relative; min-height:100vh; display:flex; align-items:center;
    overflow:hidden; padding:0 80px;
  }
  .np-hero-content { position:relative; z-index:2; max-width:560px; }

  /* ── Background pulse orb ── */
  .np-bg-orb {
    position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none;
  }

  /* ── Stats ── */
  .np-stat-num {
    font-family:'Bebas Neue',sans-serif; font-size:2.4rem; color:var(--red); line-height:1;
  }
  .np-stat-label {
    font-size:10px; letter-spacing:.14em; color:var(--muted); text-transform:uppercase;
  }

  /* ── Tag pills ── */
  .np-tag {
    font-size:10px; letter-spacing:.1em; text-transform:uppercase;
    padding:3px 11px; border-radius:20px;
    border:1px solid rgba(255,0,60,.3); color:var(--red);
    background:rgba(255,0,60,.06);
  }

  /* ── Scanline overlay ── */
  .np-scanline-wrap { position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:3; }
  .np-scanline {
    position:absolute; left:0; right:0; height:3px;
    background:linear-gradient(180deg,transparent,rgba(255,0,60,.06),transparent);
    animation:scanline 5s linear infinite;
  }

  /* ── Mobile ── */
  @media (max-width:768px) {
    .np-nav { padding:16px 20px; }
    .np-nav.scrolled { padding:12px 20px; }
    .np-nav-links { display:none; }
    .np-hero { padding:120px 20px 60px; flex-direction:column; align-items:flex-start; }
    .np-hero-content { max-width:100%; }
    .np-section { padding:70px 20px; }
    .np-flip-root { height:320px; }
  }
`;

/* ════════════════════════════════════════════════════════════
   HOOK — TYPEWRITER
════════════════════════════════════════════════════════════ */
function useTypewriter(words) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[idx];
    let t;
    if (!del && text.length < word.length)
      t = setTimeout(() => setText(word.slice(0, text.length + 1)), 78);
    else if (!del && text.length === word.length)
      t = setTimeout(() => setDel(true), 1900);
    else if (del && text.length > 0)
      t = setTimeout(() => setText(text.slice(0, -1)), 44);
    else if (del && text.length === 0) {
      setDel(false);
      setIdx((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(t);
  }, [text, del, idx, words]);
  return text;
}

/* ════════════════════════════════════════════════════════════
   THREE.JS HERO SCENE
════════════════════════════════════════════════════════════ */
function ThreeScene() {
  const mountRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500);
    camera.position.z = 30;

    /* Central TorusKnot */
    const tkMesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(6.5, 1.8, 220, 28),
      new THREE.MeshBasicMaterial({ color: 0xff003c, wireframe: true, opacity: 0.38, transparent: true })
    );
    tkMesh.position.x = 10;
    scene.add(tkMesh);

    /* Outer icosahedron cage */
    const icoMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(15, 2),
      new THREE.MeshBasicMaterial({ color: 0xff003c, wireframe: true, opacity: 0.045, transparent: true })
    );
    icoMesh.position.x = 10;
    scene.add(icoMesh);

    /* Orbiting torus rings */
    const rings = [
      [10, 0.06, 0.28, 0, 0],
      [12.5, 0.05, 0.16, 1.1, 0.5],
      [14.8, 0.04, 0.09, 2.2, 1.1],
    ].map(([r, t, op, rx, rz]) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, t, 8, 140),
        new THREE.MeshBasicMaterial({ color: 0xff003c, opacity: op, transparent: true })
      );
      m.position.x = 10;
      m.rotation.x = Math.PI / (3 + rx);
      m.rotation.z = Math.PI / (4 + rz);
      scene.add(m);
      return m;
    });

    /* Floating octahedra */
    const floaters = Array.from({ length: 14 }, () => {
      const m = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28 + Math.random() * 0.42, 0),
        new THREE.MeshBasicMaterial({ color: 0xff003c, wireframe: true, opacity: 0.5 + Math.random() * 0.3, transparent: true })
      );
      m.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 22);
      m.userData = { speed: 0.3 + Math.random() * 0.7, off: Math.random() * Math.PI * 2, iy: m.position.y };
      scene.add(m);
      return m;
    });

    /* Point-cloud particles */
    const N = 3000;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 140;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xff003c, size: 0.11, transparent: true, opacity: 0.42 }));
    scene.add(pMesh);

    /* Secondary small torus */
    const st = new THREE.Mesh(
      new THREE.TorusGeometry(3, 0.5, 12, 60),
      new THREE.MeshBasicMaterial({ color: 0xff003c, wireframe: true, opacity: 0.3, transparent: true })
    );
    st.position.set(-12, 8, -5);
    scene.add(st);

    const onMove = (e) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;
      const mx = mouse.current.x, my = mouse.current.y;

      tkMesh.rotation.x = t * 0.18 + my * 0.35;
      tkMesh.rotation.y = t * 0.27 + mx * 0.28;
      icoMesh.rotation.x = t * 0.04; icoMesh.rotation.y = t * 0.065;

      rings.forEach((r, i) => {
        r.rotation.y = t * (0.14 + i * 0.06);
        r.rotation.z = t * (0.09 + i * 0.04);
      });

      floaters.forEach((f) => {
        f.rotation.x += 0.009 * f.userData.speed;
        f.rotation.y += 0.007 * f.userData.speed;
        f.position.y = f.userData.iy + Math.sin(t * f.userData.speed + f.userData.off) * 1.6;
      });

      pMesh.rotation.y = t * 0.028;
      pMesh.rotation.x = t * 0.012;

      st.rotation.y = t * 0.4; st.rotation.x = t * 0.3;

      camera.position.x += (mx * 5 - camera.position.x) * 0.03;
      camera.position.y += (my * 3.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
}

/* ════════════════════════════════════════════════════════════
   TILT CARD — 3D perspective tilt on hover
════════════════════════════════════════════════════════════ */
function TiltCard({ children, style, intensity = 12 }) {
  const ref = useRef(null);
  const glowRef = useRef(null);

  const onMove = (e) => {
    const c = ref.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -intensity;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * intensity;
    c.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(14px) scale(1.03)`;
    c.style.boxShadow = `${-ry * 1.2}px ${rx * 1.2}px 50px rgba(255,0,60,.22)`;
    if (glowRef.current) {
      const gx = ((e.clientX - r.left) / r.width) * 100;
      const gy = ((e.clientY - r.top) / r.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,0,60,.16), transparent 65%)`;
    }
  };

  const onLeave = () => {
    const c = ref.current;
    if (!c) return;
    c.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0) scale(1)";
    c.style.boxShadow = "none";
    if (glowRef.current) glowRef.current.style.background = "transparent";
  };

  return (
    <div ref={ref} style={{ ...style, transformStyle: "preserve-3d", transition: "transform .15s ease, box-shadow .3s ease", position: "relative" }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={glowRef} style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 1, transition: "background .2s" }} />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FLIP CARD — 3D flip on hover
════════════════════════════════════════════════════════════ */
function FlipCard({ project }) {
  const [flipped, setFlipped] = useState(false);

  const corners = [["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]];

  return (
    <div className="np-flip-root" onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}>
      <div className="np-flip-inner" style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>

        {/* FRONT */}
        <div className="np-flip-face np-flip-front">
          {corners.map(([v, h]) => (
            <div key={v + h} style={{
              position: "absolute", width: "15px", height: "15px", [v]: "12px", [h]: "12px",
              borderTop: v === "top" ? "2px solid rgba(255,0,60,.45)" : "none",
              borderBottom: v === "bottom" ? "2px solid rgba(255,0,60,.45)" : "none",
              borderLeft: h === "left" ? "2px solid rgba(255,0,60,.45)" : "none",
              borderRight: h === "right" ? "2px solid rgba(255,0,60,.45)" : "none",
              transition: "all .3s",
            }} />
          ))}
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "3rem", color: "rgba(255,0,60,.2)", lineHeight: 1, marginBottom: "12px" }}>{project.num}</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {project.tags.map((t) => <span key={t} className="np-tag">{t}</span>)}
          </div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.55rem", letterSpacing: ".05em", marginBottom: "10px" }}>{project.title}</div>
          <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.65 }}>{project.desc}</p>
          <p style={{ position: "absolute", bottom: "16px", right: "16px", fontSize: "10px", letterSpacing: ".16em", color: "rgba(255,0,60,.38)", textTransform: "uppercase" }}>
            hover to flip →
          </p>
        </div>

        {/* BACK */}
        <div className="np-flip-face np-flip-back">
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem", letterSpacing: ".05em", color: "var(--red)" }}>{project.title}</div>
          <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7, maxWidth: "260px" }}>{project.backDesc}</p>
          <div style={{ display: "flex", gap: "12px" }}>
            {[["🌐 Live Demo", project.demo, true], ["📁 GitHub", project.repo, false]].map(([label, href, primary]) => (
              <a key={label} href={href}
                style={{
                  padding: "8px 20px", borderRadius: "30px",
                  background: primary ? "var(--red)" : "transparent",
                  border: "1px solid var(--red)",
                  color: "#fff", fontSize: "11px", letterSpacing: ".09em", textTransform: "uppercase",
                  textDecoration: "none", transition: "transform .2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SKILL CARD — 3D tilt + SVG progress ring
════════════════════════════════════════════════════════════ */
function SkillCard({ skill }) {
  const [hov, setHov] = useState(false);
  const R = 28;
  const circ = 2 * Math.PI * R;
  const dash = (skill.level / 100) * circ;

  return (
    <div className="np-skill-card" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position: "relative", width: "68px", height: "68px" }}>
        <svg width="68" height="68" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="34" cy="34" r={R} fill="none" stroke="rgba(255,0,60,.1)" strokeWidth="3" />
          <circle cx="34" cy="34" r={R} fill="none" stroke="#ff003c" strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={hov ? circ - dash : circ}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .85s cubic-bezier(.23,1,.32,1)" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
          {skill.icon}
        </div>
      </div>
      <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: ".04em", textAlign: "center", color: hov ? "var(--red)" : "var(--text)", transition: "color .2s" }}>
        {skill.label}
      </div>
      <div style={{ fontSize: "11px", color: "var(--muted)" }}>{skill.level}%</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   CURSOR
════════════════════════════════════════════════════════════ */
function Cursor() {
  const dotRef = useRef(null);
  const r1Ref = useRef(null);
  const r2Ref = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const p1 = useRef({ x: 0, y: 0 });
  const p2 = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dot = dotRef.current, r1 = r1Ref.current, r2 = r2Ref.current;
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    };
    const onEnter = () => {
      dot.style.transform = "translate(-50%,-50%) scale(0)";
      r1.style.width = r1.style.height = "50px";
      r1.style.borderColor = "rgba(255,0,60,.9)";
      r1.style.background = "rgba(255,0,60,.07)";
    };
    const onLeave = () => {
      dot.style.transform = "translate(-50%,-50%) scale(1)";
      r1.style.width = r1.style.height = "36px";
      r1.style.borderColor = "rgba(255,0,60,.5)";
      r1.style.background = "transparent";
    };
    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    let raf;
    const anim = () => {
      p1.current.x += (pos.current.x - p1.current.x) * 0.13;
      p1.current.y += (pos.current.y - p1.current.y) * 0.13;
      p2.current.x += (pos.current.x - p2.current.x) * 0.06;
      p2.current.y += (pos.current.y - p2.current.y) * 0.06;
      r1.style.left = p1.current.x + "px"; r1.style.top = p1.current.y + "px";
      r2.style.left = p2.current.x + "px"; r2.style.top = p2.current.y + "px";
      raf = requestAnimationFrame(anim);
    };
    anim();
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  const base = { position: "fixed", pointerEvents: "none", zIndex: 9999, transform: "translate(-50%,-50%)" };
  return (
    <>
      <div ref={dotRef} style={{ ...base, width: "8px", height: "8px", background: "#ff003c", borderRadius: "50%", transition: "transform .2s", mixBlendMode: "screen" }} />
      <div ref={r1Ref} style={{ ...base, width: "36px", height: "36px", border: "1.5px solid rgba(255,0,60,.5)", borderRadius: "50%", transition: "width .3s,height .3s,border-color .2s,background .2s", mixBlendMode: "screen" }} />
      <div ref={r2Ref} style={{ ...base, width: "66px", height: "66px", border: "1px solid rgba(255,0,60,.13)", borderRadius: "50%" }} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PORTFOLIO
════════════════════════════════════════════════════════════ */
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [sending, setSending] = useState(false);
  const [msgStatus, setMsgStatus] = useState("");
  const nameRef = useRef(null), emailRef = useRef(null), msgRef = useRef(null);
  const typed = useTypewriter(ROLES);

  /* Inject CSS */
  useEffect(() => {
    if (!document.getElementById("np-css")) {
      const s = document.createElement("style");
      s.id = "np-css";
      s.textContent = STYLES;
      document.head.appendChild(s);
    }
    return () => document.getElementById("np-css")?.remove();
  }, []);

  /* Scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Reveal on scroll */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 80); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleSend = () => {
    const n = nameRef.current?.value?.trim();
    const em = emailRef.current?.value?.trim();
    const m = msgRef.current?.value?.trim();
    if (!n || !em || !m) { setMsgStatus("fill"); return; }
    setSending(true); setMsgStatus("");
    setTimeout(() => {
      setSending(false); setMsgStatus("ok");
      [nameRef, emailRef, msgRef].forEach((r) => { if (r.current) r.current.value = ""; });
    }, 1600);
  };

  const NAV = ["Home", "Skills", "Projects", "Contact"];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Cursor />

      {/* Fixed ambient glow */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 70% 30%,rgba(255,0,60,.11),transparent 58%),radial-gradient(ellipse at 20% 80%,rgba(130,0,45,.09),transparent 50%)" }} />

      {/* ── NAV ── */}
      <nav className={`np-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="np-logo">NP<span style={{ color: "var(--red)" }}>.</span></div>
        <ul className="np-nav-links">
          {NAV.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className={`np-nav-link ${active === l.toLowerCase() ? "active" : ""}`}
                onClick={() => setActive(l.toLowerCase())}>{l}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section id="home" className="np-hero">
        <ThreeScene />

        {/* Scanline */}
        <div className="np-scanline-wrap"><div className="np-scanline" /></div>

        {/* Orbs */}
        <div className="np-bg-orb" style={{ width: "520px", height: "520px", top: "-10%", right: "-5%", background: "rgba(255,0,60,.18)", zIndex: 1 }} />
        <div className="np-bg-orb" style={{ width: "360px", height: "360px", bottom: "8%", left: "-8%", background: "rgba(140,0,50,.13)", zIndex: 1 }} />
        <div className="np-bg-orb" style={{ width: "220px", height: "220px", top: "55%", left: "38%", background: "rgba(255,0,60,.08)", zIndex: 1 }} />

        <div className="np-hero-content">
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "30px",
            border: "1px solid rgba(255,0,60,.3)", background: "rgba(255,0,60,.05)",
            fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--red)",
            marginBottom: "26px", animation: "fadeUp .6s ease both",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--red)", animation: "pulseGlow 1.6s ease infinite" }} />
            Available for Work
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(3.5rem,7vw,6rem)",
            lineHeight: 0.95, letterSpacing: ".04em",
            animation: "fadeUp .65s .08s ease both",
          }}>
            <span style={{ display: "block", color: "var(--text)", marginBottom: "4px" }}>Namrata</span>
            <span style={{
              display: "block",
              background: "linear-gradient(90deg,#ff003c,#ff6090,#ff003c)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", animation: "shimmer 3s linear infinite",
            }}>Pundhir</span>
          </h1>

          {/* Typewriter */}
          <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "20px", height: "36px", animation: "fadeUp .65s .18s ease both" }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 500, color: "var(--red)" }}>{typed}</span>
            <span style={{ fontSize: "1.3rem", color: "var(--red)", animation: "blink .8s step-end infinite" }}>|</span>
          </div>

          {/* Description */}
          <p style={{ fontSize: "1.05rem", lineHeight: 1.72, color: "var(--muted)", marginTop: "20px", maxWidth: "450px", animation: "fadeUp .65s .28s ease both" }}>
            Building modern, scalable, and fast digital experiences with React.
            Passionate about clean code, beautiful UI, and meaningful products.
          </p>

          {/* Buttons */}
          <div style={{ marginTop: "36px", display: "flex", gap: "14px", flexWrap: "wrap", animation: "fadeUp .65s .38s ease both" }}>
            <a href="#projects" className="np-btn np-btn-primary">View Projects</a>
            <a href="#contact" className="np-btn np-btn-outline">Contact Me</a>
          </div>

          {/* Stats */}
          <div style={{ marginTop: "52px", display: "flex", gap: "36px", animation: "fadeUp .65s .5s ease both" }}>
            {[["2+", "Years Exp."], ["15+", "Projects"], ["10+", "Technologies"]].map(([n, l]) => (
              <div key={l}>
                <div className="np-stat-num">{n}</div>
                <div className="np-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="np-divider" />

      {/* ══════════════════ SKILLS ══════════════════ */}
      <section id="skills" className="np-section">
        <span className="np-section-tag reveal">What I Know</span>
        <h2 className="np-section-title reveal">Skills &amp; Technologies</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "16px" }}>
          {SKILLS.map((s) => (
            <div key={s.label} className="reveal">
              <SkillCard skill={s} />
            </div>
          ))}
        </div>
      </section>

      <div className="np-divider" />

      {/* ══════════════════ PROJECTS ══════════════════ */}
      <section id="projects" className="np-section">
        <span className="np-section-tag reveal">What I've Built</span>
        <h2 className="np-section-title reveal">Projects</h2>
        <p className="reveal" style={{ color: "var(--muted)", fontSize: "13px", marginTop: "-36px", marginBottom: "40px", letterSpacing: ".05em" }}>
          ✦ Hover cards to reveal details &amp; links
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "24px" }}>
          {PROJECTS.map((p) => (
            <div key={p.num} className="reveal"><FlipCard project={p} /></div>
          ))}
        </div>
      </section>

      <div className="np-divider" />

      {/* ══════════════════ CONTACT ══════════════════ */}
      <section id="contact" className="np-section">
        <span className="np-section-tag reveal">Get In Touch</span>
        <h2 className="np-section-title reveal">Contact Me</h2>

        <div className="reveal" style={{ maxWidth: "650px", margin: "0 auto" }}>
          <TiltCard intensity={7} style={{
            background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,0,60,.18)",
            borderRadius: "24px", padding: "40px",
          }}>
            <div style={{ display: "flex", gap: "14px", marginBottom: "14px", flexWrap: "wrap" }}>
              <input ref={nameRef} className="np-input" placeholder="Your Name" type="text" style={{ flex: "1 1 200px" }} />
              <input ref={emailRef} className="np-input" placeholder="Your Email" type="email" style={{ flex: "1 1 200px" }} />
            </div>
            <textarea ref={msgRef} className="np-input" placeholder="Your message..." style={{ minHeight: "150px", resize: "vertical", display: "block", marginBottom: "16px" }} />
            <button onClick={handleSend} disabled={sending}
              style={{
                width: "100%", padding: "16px", borderRadius: "40px", border: "none",
                background: "var(--red)", color: "#fff", fontFamily: "'Outfit',sans-serif",
                fontWeight: 600, fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase",
                cursor: "none", opacity: sending ? 0.65 : 1,
                boxShadow: "0 0 32px rgba(255,0,60,.45)",
                transition: "opacity .2s, box-shadow .3s",
                animation: "pulseGlow 2.5s ease infinite",
              }}>
              {sending ? "⏳ Sending..." : "🚀 Send Message"}
            </button>
            {msgStatus === "ok" && <p style={{ color: "#00e676", textAlign: "center", marginTop: "16px", fontSize: "14px" }}>✅ Message sent successfully!</p>}
            {msgStatus === "fill" && <p style={{ color: "#ff5555", textAlign: "center", marginTop: "16px", fontSize: "13px" }}>⚠️ Please fill in all fields.</p>}

            {/* Social links */}
            <div style={{ marginTop: "28px", display: "flex", justifyContent: "center", gap: "20px" }}>
              {[["GitHub", "#"], ["LinkedIn", "#"], ["Twitter", "#"], ["Email", "mailto:namrata@example.com"]].map(([label, href]) => (
                <a key={label} href={href} style={{
                  fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase",
                  color: "var(--muted)", textDecoration: "none", transition: "color .2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                >{label}</a>
              ))}
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{
        position: "relative", zIndex: 1, textAlign: "center", padding: "28px 80px",
        borderTop: "1px solid rgba(255,0,60,.07)", fontSize: "12px",
        color: "var(--muted)", letterSpacing: ".08em",
      }}>
        Designed &amp; Built by{" "}
        <span style={{ color: "var(--red)", fontWeight: 500 }}>Namrata Pundhir</span> · 2026
      </footer>
    </div>
  );
}
