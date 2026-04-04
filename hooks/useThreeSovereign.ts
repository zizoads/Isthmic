import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type Sovereign3DMode = 'STARS' | 'NEURAL' | 'CORE';

export const useThreeSovereign = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  mode: Sovereign3DMode = 'STARS'
) => {
  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      console.error("useThreeSovereign: WebGL context creation failed", e);
      return;
    }
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Dynamic Geometry Setup
    const particlesCount = mode === 'NEURAL' ? 150 : 1500;
    const coords = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      coords[i] = (Math.random() - 0.5) * 12;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(coords, 3));

    // Material: Golden Glow
    const material = new THREE.PointsMaterial({
      size: mode === 'NEURAL' ? 0.05 : 0.015,
      color: 0xd4af37,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Neural Links (Lines between particles)
    let linesMesh: THREE.LineSegments | null = null;
    if (mode === 'NEURAL') {
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xd4af37, 
        transparent: true, 
        opacity: 0.1,
        blending: THREE.AdditiveBlending
      });
      const lineGeometry = new THREE.BufferGeometry();
      linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(linesMesh);
    }

    camera.position.z = 5;

    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);

      // Smooth mouse follow
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;

      points.rotation.y += 0.001;
      points.rotation.x += 0.0005;
      points.position.x = mouse.x * 0.5;
      points.position.y = mouse.y * 0.5;

      if (mode === 'NEURAL' && linesMesh) {
        const positions = geometry.attributes.position.array as Float32Array;
        const lineCoords = [];
        const maxDist = 2.5;

        // Neural algorithm: find neighbors
        for (let i = 0; i < particlesCount; i++) {
          for (let j = i + 1; j < particlesCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDist) {
              lineCoords.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
              lineCoords.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
            }
          }
        }
        linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
        linesMesh.rotation.copy(points.rotation);
        linesMesh.position.copy(points.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      if (linesMesh) {
        linesMesh.geometry.dispose();
        (linesMesh.material as THREE.Material).dispose();
      }
      renderer.dispose();
    };
  }, [mode]);

  return null;
};