import { useEffect, useRef } from "react";
import * as THREE from "three";

function GameScenePlaceholder() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountNode = mountRef.current;

    if (!mountNode) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#091521");

    const camera = new THREE.PerspectiveCamera(
      60,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    mountNode.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight("#9ad8ff", 1.2);
    const directionalLight = new THREE.DirectionalLight("#ffffff", 1.3);
    directionalLight.position.set(4, 6, 5);
    scene.add(ambientLight, directionalLight);

    const platformGeometry = new THREE.CylinderGeometry(3.2, 3.2, 0.35, 40);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: "#114161",
      metalness: 0.35,
      roughness: 0.45
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -1.2;
    scene.add(platform);

    const containerGeometry = new THREE.BoxGeometry(2.4, 1.4, 1.4);
    const containerMaterial = new THREE.MeshStandardMaterial({
      color: "#1e7fb6",
      metalness: 0.25,
      roughness: 0.5
    });
    const container = new THREE.Mesh(containerGeometry, containerMaterial);
    scene.add(container);

    const frameGeometry = new THREE.EdgesGeometry(containerGeometry);
    const frameMaterial = new THREE.LineBasicMaterial({ color: "#d7f3ff" });
    const frame = new THREE.LineSegments(frameGeometry, frameMaterial);
    scene.add(frame);

    const loaderSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 24),
      new THREE.MeshStandardMaterial({
        color: "#8cf0b5",
        emissive: "#2f8b5b",
        emissiveIntensity: 0.4
      })
    );
    loaderSphere.position.set(-1.15, 0.15, 0.95);
    scene.add(loaderSphere);

    const pulseRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.05, 12, 40),
      new THREE.MeshStandardMaterial({
        color: "#4ec7ff",
        emissive: "#1f8db7",
        emissiveIntensity: 0.5
      })
    );
    pulseRing.rotation.x = Math.PI / 2;
    pulseRing.position.y = -0.45;
    scene.add(pulseRing);

    let animationFrameId = 0;

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);

      container.rotation.y += 0.008;
      frame.rotation.y += 0.008;
      loaderSphere.position.y = 0.15 + Math.sin(Date.now() * 0.002) * 0.18;
      pulseRing.rotation.z += 0.01;

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!mountNode) {
        return;
      }

      camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    };

    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      mountNode.removeChild(renderer.domElement);

      platformGeometry.dispose();
      platformMaterial.dispose();
      containerGeometry.dispose();
      containerMaterial.dispose();
      frameGeometry.dispose();
      frameMaterial.dispose();
      loaderSphere.geometry.dispose();
      loaderSphere.material.dispose();
      pulseRing.geometry.dispose();
      pulseRing.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="game-scene-shell">
      <div ref={mountRef} className="game-scene-canvas" />
      <div className="game-scene-label">
        <strong>Three.js Placeholder Scene</strong>
        <span>Visual shell only. Final mission logic is not implemented in Phase 2.</span>
      </div>
    </div>
  );
}

export default GameScenePlaceholder;
