import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  label?: string;
}

const PrestigeLoader: React.FC<Props> = ({ label }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.error("PrestigeLoader: WebGL context creation failed", e);
      return;
    }
    renderer.setSize(100, 100);
    mountRef.current.appendChild(renderer.domElement);

    // Sovereign Icosahedron Logic
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xd4af37, 
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 3.5;
    let requestRef: number;

    const animate = () => {
      requestRef = requestAnimationFrame(animate);
      mesh.rotation.y += 0.02;
      mesh.rotation.z += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(requestRef);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in py-12">
      <div className="relative">
        <div ref={mountRef} className="w-24 h-24 flex items-center justify-center"></div>
        <div className="absolute inset-0 border-2 border-[#d4af37]/10 rounded-full animate-pulse"></div>
      </div>
      {label && (
        <div className="text-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] animate-pulse">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

export default PrestigeLoader;