import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !stickyRef.current || !sectionRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const setSize = () => {
      const w = stickyRef.current!.clientWidth;
      const h = stickyRef.current!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const group = new THREE.Group();
    scene.add(group);

    // Globe wireframe
    const globeGeo = new THREE.SphereGeometry(1.6, 32, 24);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x00ff41,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    group.add(globe);

    // Inner solid (very dark, gives mass)
    const innerGeo = new THREE.SphereGeometry(1.55, 32, 24);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.85 });
    group.add(new THREE.Mesh(innerGeo, innerMat));

    // Network nodes (Points) on sphere surface + scattered cloud
    const NODE_COUNT = 140;
    const nodePositions = new Float32Array(NODE_COUNT * 3);
    const targetPositions = new Float32Array(NODE_COUNT * 3); // on sphere
    const startPositions = new Float32Array(NODE_COUNT * 3); // scattered
    for (let i = 0; i < NODE_COUNT; i++) {
      // sphere surface (slightly above globe)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.75;
      targetPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      targetPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      targetPositions[i * 3 + 2] = r * Math.cos(phi);
      // start scattered
      startPositions[i * 3] = (Math.random() - 0.5) * 8;
      startPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      startPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      // initial = start
      nodePositions[i * 3] = startPositions[i * 3];
      nodePositions[i * 3 + 1] = startPositions[i * 3 + 1];
      nodePositions[i * 3 + 2] = startPositions[i * 3 + 2];
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x00ff41,
      size: 0.045,
      transparent: true,
      opacity: 0.9,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodes);

    // Connections — pre-build pairs of close-by nodes
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
      color: 0x00ff41,
      transparent: true,
      opacity: 0,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    setSize();
    window.addEventListener("resize", setSize);

    // Progress driven by ScrollTrigger (0-1)
    const state = { p: 0 };

    const updateNodes = () => {
      const t = Math.min(1, state.p / 0.4); // assemble during phase 1
      const eased = 1 - Math.pow(1 - t, 3);
      const arr = nodeGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < NODE_COUNT; i++) {
        arr[i * 3] = startPositions[i * 3] + (targetPositions[i * 3] - startPositions[i * 3]) * eased;
        arr[i * 3 + 1] = startPositions[i * 3 + 1] + (targetPositions[i * 3 + 1] - startPositions[i * 3 + 1]) * eased;
        arr[i * 3 + 2] = startPositions[i * 3 + 2] + (targetPositions[i * 3 + 2] - startPositions[i * 3 + 2]) * eased;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      // Update line endpoints to follow current node positions
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

      // line opacity: phase 2 (0.4 - 0.7)
      const lp = Math.max(0, Math.min(1, (state.p - 0.4) / 0.3));
      lineMat.opacity = lp * 0.4;
      // globe shifts right + camera zooms slightly in phase 3
      const tp = Math.max(0, Math.min(1, (state.p - 0.6) / 0.3));
      group.position.x = tp * 1.1;
    };

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      group.rotation.y += dt * 0.15;
      group.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.1;
      // gentle pulse on globe wireframe
      globeMat.opacity = 0.2 + Math.sin(clock.elapsedTime * 1.5) * 0.08;
      // node random blink
      nodeMat.opacity = 0.7 + Math.sin(clock.elapsedTime * 2.3) * 0.15;
      updateNodes();
      renderer.render(scene, camera);
    };
    animate();

    // ScrollTrigger
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: stickyRef.current,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
          state.p = self.progress;
          // Text reveal during phase 3
          if (textRef.current) {
            const tp = Math.max(0, Math.min(1, (state.p - 0.65) / 0.25));
            textRef.current.style.opacity = String(tp);
            textRef.current.style.transform = `translateX(${(1 - tp) * -40}px)`;
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
      style={{ height: "400vh" }}
    >
      <div ref={stickyRef} className="h-screen w-full sticky top-0 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16">
          <div
            ref={textRef}
            className="max-w-xl"
            style={{ opacity: 0 }}
          >
            <div className="font-terminal text-sm text-terminal/70 mb-4">
              guilherme@portfolio:~$
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-terminal-bright glow-text-strong leading-tight mb-3">
              &gt; Guilherme Aires
            </h2>
            <p className="font-terminal text-base md:text-xl text-terminal mb-2 glow-text">
              &gt; NOC Analyst | DevOps | Developer
            </p>
            <p className="font-terminal text-sm md:text-base text-terminal/70 mb-8">
              &gt; Disponível para freelas e oportunidades
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/55XXXXXXXXXX"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-terminal text-background px-6 py-3 font-terminal hover:bg-terminal/80 transition-colors glow-box"
              >
                <span className="opacity-60">$</span>
                ./hire_me.sh
              </a>
              <a
                href="https://github.com/GuilhermeGms3"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-terminal text-terminal px-6 py-3 font-terminal hover:bg-terminal hover:text-background transition-colors"
              >
                <span className="opacity-60">$</span>
                ./view_github.sh
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 font-terminal text-xs text-terminal/40">
          [ network.globe :: rendering @60fps ]
        </div>
      </div>
    </section>
  );
}
