'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PALETTE = [0x121017, 0x1b2440, 0x96392b, 0xb8944f, 0xd7c7a0];

export default function SwatchFan() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas.parentElement;
    if (!canvas || !wrap) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const size = () => {
      renderer.setSize(wrap.clientWidth, wrap.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 6.5);

    const group = new THREE.Group();
    const n = PALETTE.length;
    PALETTE.forEach((c, i) => {
      const geo = new THREE.BoxGeometry(1.5, 4.4, 0.06);
      const mat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: c === 0xb8944f ? 0.65 : 0.1 });
      const m = new THREE.Mesh(geo, mat);
      const angle = (i - (n - 1) / 2) * 0.34;
      m.position.set(Math.sin(angle) * 0.9, -1.6, Math.cos(angle) * 0.9 - 1.2);
      m.rotation.y = angle;
      group.add(m);
    });
    scene.add(group);
    group.position.y = 1.1;

    scene.add(new THREE.AmbientLight(0xf5efe2, 0.7));
    const dl = new THREE.DirectionalLight(0xfff3d6, 1.0);
    dl.position.set(3, 4, 5);
    scene.add(dl);

    let dragging = false, lastX = 0, rotY = 0.15, velocity = 0;

    const onDown = (e) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); };
    const onUp = () => { dragging = false; };
    const onMoveDrag = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx * 0.008;
      rotY += velocity;
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointermove', onMoveDrag);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!dragging) { velocity *= 0.94; rotY += velocity + 0.0018; }
      group.rotation.y = rotY;
      renderer.render(scene, camera);
    };

    const onResize = () => {
      size();
      camera.aspect = wrap.clientWidth / wrap.clientHeight;
      camera.updateProjectionMatrix();
    };

    size();
    animate();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointermove', onMoveDrag);
      window.removeEventListener('resize', onResize);
      group.children.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="fan-canvas" />;
}
