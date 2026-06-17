import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CPU3DScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    model: THREE.Group | null;
    particles: THREE.Points;
    gridHelper: THREE.Group;
    circuitNodes: THREE.Group;
    clock: THREE.Clock;
    animationId: number;
    scrollProgress: { value: number };
  } | null>(null);

  // Create floating particles system
  const createParticles = useCallback(() => {
    const count = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 8 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Cyan to purple gradient colors
      const t = Math.random();
      colors[i3] = 0.1 + t * 0.4; // R
      colors[i3 + 1] = 0.6 + t * 0.3; // G
      colors[i3 + 2] = 0.9 + t * 0.1; // B

      sizes[i] = Math.random() * 3 + 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    return new THREE.Points(geometry, material);
  }, []);

  // Create holographic grid
  const createHolographicGrid = useCallback(() => {
    const group = new THREE.Group();

    // Circular grid rings
    for (let i = 1; i <= 5; i++) {
      const ringGeometry = new THREE.RingGeometry(
        i * 1.5 - 0.02,
        i * 1.5,
        64
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x00e5ff),
        transparent: true,
        opacity: 0.08 + (5 - i) * 0.02,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -2.5;
      group.add(ring);
    }

    // Radial lines
    for (let i = 0; i < 12; i++) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -2.5, 0),
        new THREE.Vector3(
          Math.cos((i * Math.PI * 2) / 12) * 7.5,
          -2.5,
          Math.sin((i * Math.PI * 2) / 12) * 7.5
        ),
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);
    }

    return group;
  }, []);

  // Create floating circuit nodes
  const createCircuitNodes = useCallback(() => {
    const group = new THREE.Group();
    const nodeCount = 30;

    for (let i = 0; i < nodeCount; i++) {
      const nodeGeometry = new THREE.OctahedronGeometry(0.05 + Math.random() * 0.08, 0);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6),
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);

      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 5;
      node.position.set(
        Math.cos(angle) * radius,
        -2 + Math.random() * 5,
        Math.sin(angle) * radius
      );

      node.userData = {
        originalY: node.position.y,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        orbitSpeed: 0.1 + Math.random() * 0.3,
        orbitRadius: radius,
        orbitAngle: angle,
      };

      group.add(node);
    }

    // Connect some nodes with lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < nodeCount - 1; i += 3) {
      const child1 = group.children[i] as THREE.Mesh;
      const child2 = group.children[i + 1] as THREE.Mesh;
      if (child1 && child2) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([
          child1.position.clone(),
          child2.position.clone(),
        ]);
        const line = new THREE.Line(lineGeom, linesMaterial);
        line.userData.isConnector = true;
        group.add(line);
      }
    }

    return group;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030810, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Lighting setup — cinematic
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.5);
    scene.add(ambientLight);

    // Key light — warm cyan
    const keyLight = new THREE.DirectionalLight(0x00e5ff, 2.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill light — purple
    const fillLight = new THREE.DirectionalLight(0x7c3aed, 1.5);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    // Rim light — electric blue
    const rimLight = new THREE.DirectionalLight(0x3b82f6, 2.0);
    rimLight.position.set(0, -2, -8);
    scene.add(rimLight);

    // Accent spot light — top down
    const spotLight = new THREE.SpotLight(0x00e5ff, 3, 20, Math.PI / 6, 0.5);
    spotLight.position.set(0, 10, 0);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Bottom glow point light
    const bottomGlow = new THREE.PointLight(0x7c3aed, 1.5, 10);
    bottomGlow.position.set(0, -3, 0);
    scene.add(bottomGlow);

    // Create effects
    const particles = createParticles();
    scene.add(particles);

    const gridHelper = createHolographicGrid();
    scene.add(gridHelper);

    const circuitNodes = createCircuitNodes();
    scene.add(circuitNodes);

    const clock = new THREE.Clock();
    const scrollProgress = { value: 0 };

    sceneRef.current = {
      scene,
      camera,
      renderer,
      model: null,
      particles,
      gridHelper,
      circuitNodes,
      clock,
      animationId: 0,
      scrollProgress,
    };

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      "/Models3D/masterCPU-3D.glb",
      (gltf) => {
        const model = gltf.scene;

        // Center and scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.y += 0.3;

        // Enhance materials
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.envMapIntensity = 1.5;
              child.material.roughness = Math.min(child.material.roughness, 0.6);
              child.material.metalness = Math.max(child.material.metalness, 0.3);
              child.material.needsUpdate = true;
            }
          }
        });

        scene.add(model);
        if (sceneRef.current) {
          sceneRef.current.model = model;
        }

        // Initial model state — hidden, will be revealed on scroll
        model.rotation.y = -Math.PI / 4;
        gsap.set(model.scale, { x: scale * 0.5, y: scale * 0.5, z: scale * 0.5 });
        gsap.set(model.position, { y: model.position.y - 1 });

        // GSAP scroll animation timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1.5,
            onUpdate: (self) => {
              scrollProgress.value = self.progress;
            },
          },
        });

        // Phase 1: Model appears and rises (0% - 30%)
        tl.to(
          model.scale,
          {
            x: scale,
            y: scale,
            z: scale,
            duration: 0.3,
            ease: "power2.out",
          },
          0
        );
        tl.to(
          model.position,
          {
            y: 0.3,
            duration: 0.3,
            ease: "power2.out",
          },
          0
        );

        // Phase 2: Full rotation showcase (0% - 100%)
        tl.to(
          model.rotation,
          {
            y: Math.PI * 2 - Math.PI / 4,
            duration: 1,
            ease: "none",
          },
          0
        );

        // Phase 3: Camera zoom in (30% - 60%)
        tl.to(
          camera.position,
          {
            z: 5.5,
            y: 1,
            duration: 0.3,
            ease: "power1.inOut",
          },
          0.3
        );

        // Phase 4: Camera pulls back and orbits slightly (60% - 100%)
        tl.to(
          camera.position,
          {
            z: 9,
            y: 3,
            x: 2,
            duration: 0.4,
            ease: "power1.inOut",
          },
          0.6
        );

        // Grid and nodes fade in
        tl.fromTo(
          gridHelper.children.map((c) => (c as THREE.Mesh).material),
          { opacity: 0 },
          { opacity: 0.15, duration: 0.3, stagger: 0.02 },
          0.1
        );
      },
      undefined,
      (error) => {
        console.error("Error loading 3D model:", error);
      }
    );

    // Animation loop
    const animate = () => {
      const s = sceneRef.current;
      if (!s) return;

      s.animationId = requestAnimationFrame(animate);
      const elapsed = s.clock.getElapsedTime();

      // Rotate particles slowly
      s.particles.rotation.y = elapsed * 0.05;
      s.particles.rotation.x = Math.sin(elapsed * 0.03) * 0.1;

      // Animate particle positions (slight undulation)
      const positions = (s.particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsed * 0.5 + positions[i] * 0.5) * 0.001;
      }
      s.particles.geometry.attributes.position.needsUpdate = true;

      // Rotate grid
      s.gridHelper.rotation.y = elapsed * 0.1;

      // Animate circuit nodes
      s.circuitNodes.children.forEach((child) => {
        if (child.userData.isConnector) return;
        const node = child as THREE.Mesh;
        const { originalY, speed, phase, orbitSpeed, orbitRadius, orbitAngle } = node.userData;

        node.position.y = originalY + Math.sin(elapsed * speed + phase) * 0.3;
        const currentAngle = orbitAngle + elapsed * orbitSpeed * 0.1;
        node.position.x = Math.cos(currentAngle) * orbitRadius;
        node.position.z = Math.sin(currentAngle) * orbitRadius;
        node.rotation.y = elapsed * speed;
        node.rotation.z = elapsed * speed * 0.5;
      });

      // Subtle model float
      if (s.model) {
        s.model.position.y += Math.sin(elapsed * 0.8) * 0.0005;
      }

      // Update camera lookAt based on scroll
      camera.lookAt(0, scrollProgress.value * 0.3, 0);

      // Pulsing lights
      spotLight.intensity = 3 + Math.sin(elapsed * 2) * 0.5;
      bottomGlow.intensity = 1.5 + Math.sin(elapsed * 1.5 + 1) * 0.3;

      s.renderer.render(s.scene, s.camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      const { camera: cam, renderer: rend } = sceneRef.current;
      cam.aspect = container.clientWidth / container.clientHeight;
      cam.updateProjectionMatrix();
      rend.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        sceneRef.current.scene.clear();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [createParticles, createHolographicGrid, createCircuitNodes]);

  return (
    <section
      ref={containerRef}
      id="cpu-3d-scene"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0, 229, 255, 0.06) 0%, rgba(124, 58, 237, 0.04) 40%, transparent 70%)",
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Overlay text - bottom left */}
      <div
        className="absolute bottom-12 left-8 z-10 max-w-md"
        style={{ pointerEvents: "none" }}
      >
        <p
          className="text-xs uppercase tracking-[0.4em] mb-3"
          style={{ color: "rgba(0, 229, 255, 0.6)" }}
        >
          Powered by Innovation
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{
            background: "linear-gradient(135deg, #00e5ff 0%, #7c3aed 50%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Next-Gen Technology
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed opacity-70">
          Crafted with precision engineering and cutting-edge architecture
        </p>
      </div>

      {/* Scan lines effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 229, 255, 0.015) 2px, rgba(0, 229, 255, 0.015) 4px)",
        }}
      />

      {/* Corner decorations */}
      <div
        className="absolute top-6 left-6 w-16 h-16 pointer-events-none"
        style={{
          zIndex: 3,
          borderTop: "1px solid rgba(0, 229, 255, 0.3)",
          borderLeft: "1px solid rgba(0, 229, 255, 0.3)",
        }}
      />
      <div
        className="absolute top-6 right-6 w-16 h-16 pointer-events-none"
        style={{
          zIndex: 3,
          borderTop: "1px solid rgba(0, 229, 255, 0.3)",
          borderRight: "1px solid rgba(0, 229, 255, 0.3)",
        }}
      />
      <div
        className="absolute bottom-6 left-6 w-16 h-16 pointer-events-none"
        style={{
          zIndex: 3,
          borderBottom: "1px solid rgba(0, 229, 255, 0.3)",
          borderLeft: "1px solid rgba(0, 229, 255, 0.3)",
        }}
      />
      <div
        className="absolute bottom-6 right-6 w-16 h-16 pointer-events-none"
        style={{
          zIndex: 3,
          borderBottom: "1px solid rgba(0, 229, 255, 0.3)",
          borderRight: "1px solid rgba(0, 229, 255, 0.3)",
        }}
      />

      {/* Top and bottom gradient fades for smooth section transition */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          zIndex: 4,
          background: "linear-gradient(to bottom, hsl(var(--background)), transparent)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          zIndex: 4,
          background: "linear-gradient(to top, hsl(var(--background)), transparent)",
        }}
      />
    </section>
  );
};

export default CPU3DScene;
