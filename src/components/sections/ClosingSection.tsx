import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !stickyRef.current || !sectionRef.current) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const NODE_COUNT = isMobile ? 80 : 200;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const setSize = () => {
      const w = stickyRef.current!.clientWidth;
      const h = stickyRef.current!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const group = new THREE.Group();
    scene.add(group);

    // Globe wireframe — blue
    const globeGeo = new THREE.SphereGeometry(1.6, 36, 26);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x1a6eff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    group.add(globe);

    // Inner solid mass
    const innerGeo = new THREE.SphereGeometry(1.55, 36, 26);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.85 });
    group.add(new THREE.Mesh(innerGeo, innerMat));

    // Accent equatorial ring — green
    const ringGeo = new THREE.TorusGeometry(1.65, 0.005, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Nodes — gradient by Y position (blue top → green bottom)
    const nodePositions = new Float32Array(NODE_COUNT * 3);
    const targetPositions = new Float32Array(NODE_COUNT * 3);
    const startPositions = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.78;
      const tx = r * Math.sin(phi) * Math.cos(theta);
      const ty = r * Math.sin(phi) * Math.sin(theta);
      const tz = r * Math.cos(phi);
      targetPositions[i * 3] = tx;
      targetPositions[i * 3 + 1] = ty;
      targetPositions[i * 3 + 2] = tz;
      startPositions[i * 3] = (Math.random() - 0.5) * 10;
      startPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      startPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      nodePositions[i * 3] = startPositions[i * 3];
      nodePositions[i * 3 + 1] = startPositions[i * 3 + 1];
      nodePositions[i * 3 + 2] = startPositions[i * 3 + 2];

      // gradient: y from -1.6 (green) to +1.6 (blue)
      const t = (ty + 1.6) / 3.2;
      // mix #1A6EFF (0.1, 0.43, 1) at top with #00FF41 (0, 1, 0.25) at bottom
      colors[i * 3] = 0.1 * t + 0 * (1 - t);
      colors[i * 3 + 1] = 0.43 * t + 1 * (1 - t);
      colors[i * 3 + 2] = 1 * t + 0.25 * (1 - t);
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.95,
      vertexColors: true,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodes);

    // Connections
    const linePairs: Array<[number, number]> = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = targetPositions[i * 3] - targetPositions[j * 3];
        const dy = targetPositions[i * 3 + 1] - targetPositions[j * 3 + 1];
        const dz = targetPositions[i * 3 + 2] - targetPositions[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 0.85) linePairs.push([i, j]);
      }
    }
    const linePositions = new Float32Array(linePairs.length * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1a6eff,
      transparent: true,
      opacity: 0,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    setSize();
    window.addEventListener("resize", setSize);

    const state = { p: 0 };

    const updateNodes = () => {
      const t = Math.min(1, state.p / 0.2);
      const eased = 1 - Math.pow(1 - t, 3);
      const arr = nodeGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < NODE_COUNT; i++) {
        arr[i * 3] = startPositions[i * 3] + (targetPositions[i * 3] - startPositions[i * 3]) * eased;
        arr[i * 3 + 1] = startPositions[i * 3 + 1] + (targetPositions[i * 3 + 1] - startPositions[i * 3 + 1]) * eased;
        arr[i * 3 + 2] = startPositions[i * 3 + 2] + (targetPositions[i * 3 + 2] - startPositions[i * 3 + 2]) * eased;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      for (let k = 0; k < linePairs.length; k++) {
        const [a, b] = linePairs[k];
        linePositions[k * 6] = arr[a * 3];
        linePositions[k * 6 + 1] = arr[a * 3 + 1];
        linePositions[k * 6 + 2] = arr[a * 3 + 2];
        linePositions[k * 6 + 3] = arr[b * 3];
        linePositions[k * 6 + 4] = arr[b * 3 + 1];
        linePositions[k * 6 + 5] = arr[b * 3 + 2];
      }
      lineGeo.attributes.position.needsUpdate = true;

      // line opacity phase 2 (0.2 → 0.5)
      const lp = Math.max(0, Math.min(1, (state.p - 0.2) / 0.3));
      lineMat.opacity = lp * 0.45;
      // hue blend toward green as it grows
      lineMat.color.setRGB(0.1 + lp * 0.05, 0.43 + lp * 0.3, 1 - lp * 0.4);

      // group shifts right phase 3 (0.5 → 0.75)
      const tp = Math.max(0, Math.min(1, (state.p - 0.5) / 0.25));
      group.position.x = tp * 1.4;
    };

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      group.rotation.y += dt * 0.18;
      group.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.08;
      ring.rotation.z += dt * 0.4;
      globeMat.opacity = 0.18 + Math.sin(clock.elapsedTime * 1.2) * 0.07;
      // node random shimmer
      nodeMat.opacity = 0.8 + Math.sin(clock.elapsedTime * 2.4) * 0.15;
      updateNodes();
      renderer.render(scene, camera);
    };
    animate();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stickyRef.current,
        pinSpacing: false,
        scrub: typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches ? 7 : 14,
        onUpdate: (self) => {
          state.p = self.progress;
          if (textRef.current) {
            const tp = Math.max(0, Math.min(1, (state.p - 0.55) / 0.2));
            textRef.current.style.opacity = String(tp);
            textRef.current.style.transform = `translateX(${(1 - tp) * -40}px)`;
          }
          if (buttonsRef.current) {
            const bp = Math.max(0, Math.min(1, (state.p - 0.78) / 0.18));
            buttonsRef.current.style.opacity = String(bp);
            buttonsRef.current.style.transform = `scale(${0.85 + bp * 0.15})`;
          }
        },
      });
    }, sectionRef);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
      ctx.revert();
      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="closing"
      className="relative"
      style={{ height: "600vh", background: "#0a0a0a" }}
    >
      <div ref={stickyRef} className="h-screen w-full sticky top-0 overflow-hidden">
        {/* atmospheric gradients */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(26,110,255,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(0,255,65,0.12) 0%, transparent 50%)",
          }}
        />

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16">
          <div ref={textRef} className="max-w-xl" style={{ opacity: 0, willChange: "transform, opacity" }}>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-4 flex items-center gap-3">
              <span className="inline-block h-px w-8 grad-bg" />
              fim de linha
            </div>
            <h2 className="font-display font-semibold text-5xl md:text-7xl text-white tracking-tight leading-[1.05] mb-4">
              Guilherme <span className="grad-text">Aires</span>
            </h2>
            <p className="text-lg md:text-xl text-white/85 mb-2">
              NOC Analyst · DevOps · Developer
            </p>
            <p className="text-muted mb-3">São Paulo, Brasil</p>
            <p className="font-mono text-sm grad-text mb-10">
              Disponível para freelas e oportunidades
            </p>

            <div ref={buttonsRef} className="flex flex-wrap gap-4" style={{ opacity: 0, willChange: "transform, opacity" }}>
              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="#contact"
                className="inline-flex items-center gap-2 grad-bg text-black px-6 py-3 rounded-md font-display font-medium tracking-tight glow-grad"
              >
                Entre em Contato
                <span aria-hidden>→</span>
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="https://github.com/GuilhermeGms3"
                target="_blank"
                rel="noreferrer"
                className="grad-border inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-display tracking-tight bg-black/30"
              >
                Ver GitHub
              </motion.a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
          network · 60fps
        </div>
      </div>
    </section>
  );
}
