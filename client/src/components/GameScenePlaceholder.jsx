import { useEffect, useRef } from "react";
import * as THREE from "three";

function GameScenePlaceholder({
  gameId,
  menuOpen = false,
  commandRequest = null,
  onSelectContainer,
  onStatsChange,
  onGameOver
}) {
  const mountRef = useRef(null);
  const runtimeRef = useRef({
    executeCommand: () => {}
  });
  const callbacksRef = useRef({
    onSelectContainer,
    onStatsChange,
    onGameOver,
    menuOpen
  });

  useEffect(() => {
    callbacksRef.current = {
      onSelectContainer,
      onStatsChange,
      onGameOver,
      menuOpen
    };
  }, [menuOpen, onGameOver, onSelectContainer, onStatsChange]);

  useEffect(() => {
    if (!commandRequest?.id) {
      return;
    }

    runtimeRef.current.executeCommand(commandRequest.command, commandRequest.containerId);
  }, [commandRequest]);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) {
      return undefined;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#7bbbe0");
    scene.fog = new THREE.FogExp2("#7bbbe0", 0.017);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(11.2, 11.8, 15.2);
    camera.lookAt(-0.8, -1.15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.68);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#ffffff", 1.15);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -15;
    sunLight.shadow.camera.right = 15;
    sunLight.shadow.camera.top = 15;
    sunLight.shadow.camera.bottom = -15;
    scene.add(sunLight);

    const dangerLight = new THREE.PointLight("#ff2a2a", 0, 20);
    dangerLight.position.set(0, 8, 0);
    scene.add(dangerLight);

    const waterGeometry = new THREE.PlaneGeometry(200, 200, 36, 36);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: "#0a78a6",
      roughness: 0.15,
      metalness: 0.78,
      flatShading: true
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -2;
    water.receiveShadow = true;
    scene.add(water);

    const whaleGroup = new THREE.Group();
    whaleGroup.scale.set(1.35, 1.35, 1.35);
    whaleGroup.position.y = -1.35;
    scene.add(whaleGroup);

    const whaleMaterial = new THREE.MeshStandardMaterial({
      color: "#0db7ed",
      roughness: 0.3
    });

    const shape = new THREE.Shape();
    shape.moveTo(-3.5, 0);
    shape.lineTo(3.5, 0);
    shape.bezierCurveTo(6.0, 0, 5.5, -3.0, 3.0, -3.0);
    shape.bezierCurveTo(0, -3.0, -2.0, -2.0, -3.5, 0);

    const bodyGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: 2.0,
      bevelEnabled: true,
      bevelSegments: 12,
      steps: 1,
      bevelSize: 0.8,
      bevelThickness: 0.8
    });
    bodyGeometry.translate(0, 0, -1.0);

    const body = new THREE.Mesh(bodyGeometry, whaleMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    whaleGroup.add(body);

    const tailGroup = new THREE.Group();
    tailGroup.position.set(-4.0, -0.4, 0);
    const flukeGeometry = new THREE.SphereGeometry(1, 16, 16);
    const leftFluke = new THREE.Mesh(flukeGeometry, whaleMaterial);
    leftFluke.position.set(0, 0, 0.8);
    leftFluke.scale.set(0.7, 0.2, 1.2);
    leftFluke.rotation.y = -Math.PI / 6;
    leftFluke.castShadow = true;
    tailGroup.add(leftFluke);

    const rightFluke = new THREE.Mesh(flukeGeometry, whaleMaterial);
    rightFluke.position.set(0, 0, -0.8);
    rightFluke.scale.set(0.7, 0.2, 1.2);
    rightFluke.rotation.y = Math.PI / 6;
    rightFluke.castShadow = true;
    tailGroup.add(rightFluke);
    whaleGroup.add(tailGroup);

    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });
    const leftEyeWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      eyeWhiteMaterial
    );
    leftEyeWhite.position.set(3.4, -0.6, 1.7);
    const rightEyeWhite = leftEyeWhite.clone();
    rightEyeWhite.position.set(3.4, -0.6, -1.7);
    whaleGroup.add(leftEyeWhite, rightEyeWhite);

    const eyeBlackMaterial = new THREE.MeshStandardMaterial({ color: "#000000" });
    const leftEyeBlack = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      eyeBlackMaterial
    );
    leftEyeBlack.position.set(3.6, -0.5, 1.9);
    const rightEyeBlack = leftEyeBlack.clone();
    rightEyeBlack.position.set(3.6, -0.5, -1.9);
    whaleGroup.add(leftEyeBlack, rightEyeBlack);

    const containersGroup = new THREE.Group();
    containersGroup.position.set(0, 1.4, 0);
    whaleGroup.add(containersGroup);

    const containerGeometry = new THREE.BoxGeometry(2.3, 1.2, 1.1);
    const containerEdges = new THREE.EdgesGeometry(containerGeometry);
    const palettes = ["#2496ed", "#1d63ed", "#00bfff", "#2cb34a"];
    const dockerCubes = [];

    const statsRef = {
      score: 0,
      health: 100,
      isGameOver: false,
      gameOverSent: false,
      commandCounts: {
        start: 0,
        stop: 0,
        restart: 0,
        commit: 0
      }
    };

    const selectionRef = {
      cubeId: "",
      x: 0,
      y: 0
    };

    function getCounts() {
      return {
        runningCount: dockerCubes.filter((cube) => cube.userData.state === "running").length,
        crashedCount: dockerCubes.filter((cube) => cube.userData.state === "crashed").length,
        stoppedCount: dockerCubes.filter((cube) => cube.userData.state === "stopped").length
      };
    }

    function emitStats() {
      callbacksRef.current.onStatsChange?.({
        score: Math.max(0, statsRef.score),
        health: Math.max(0, statsRef.health),
        ...getCounts(),
        commandCounts: { ...statsRef.commandCounts }
      });
    }

    function clearHighlights() {
      dockerCubes.forEach((cube) => {
        cube.userData.isSelected = false;
        cube.userData.highlight.material.opacity = 0;
      });
    }

    function updateSelectionMenu(cube, clickX, clickY) {
      selectionRef.cubeId = cube.userData.id;
      selectionRef.x = clickX;
      selectionRef.y = clickY;
      callbacksRef.current.onSelectContainer?.({
        x: clickX,
        y: clickY,
        cubeId: cube.userData.id,
        cubeState: cube.userData.state
      });
    }

    function setContainerState(cube, nextState) {
      cube.userData.state = nextState;

      if (nextState === "running") {
        cube.material.color.set(cube.userData.baseColor);
        cube.material.emissive.set("#000000");
        cube.material.emissiveIntensity = 0;
      }

      if (nextState === "stopped") {
        cube.material.color.set("#5a6570");
        cube.material.emissive.set("#000000");
        cube.material.emissiveIntensity = 0;
      }

      if (nextState === "crashed") {
        cube.material.color.set("#ff2222");
      }

      if (selectionRef.cubeId === cube.userData.id) {
        updateSelectionMenu(cube, selectionRef.x, selectionRef.y);
      }
    }

    function createContainer(x, y, z, id) {
      const baseColor = palettes[Math.floor(Math.random() * palettes.length)];
      const material = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.4,
        metalness: 0.12
      });
      const mesh = new THREE.Mesh(containerGeometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const edgeLines = new THREE.LineSegments(
        containerEdges,
        new THREE.LineBasicMaterial({
          color: "#ffffff",
          transparent: true,
          opacity: 0.3
        })
      );
      mesh.add(edgeLines);

      const highlight = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 1.3, 1.2),
        new THREE.MeshBasicMaterial({
          color: "#ffe56b",
          wireframe: true,
          transparent: true,
          opacity: 0
        })
      );
      mesh.add(highlight);

      mesh.userData = {
        id,
        state: "running",
        baseColor,
        isSelected: false,
        highlight
      };

      containersGroup.add(mesh);
      dockerCubes.push(mesh);
    }

    const containerPositions = [
      [-2.4, 0, -0.6],
      [-2.4, 0, 0.6],
      [0, 0, -0.6],
      [0, 0, 0.6],
      [2.4, 0, -0.6],
      [2.4, 0, 0.6],
      [-2.4, 1.2, -0.6],
      [-2.4, 1.2, 0.6],
      [0, 1.2, -0.6],
      [0, 1.2, 0.6],
      [2.4, 1.2, -0.6],
      [2.4, 1.2, 0.6],
      [0, 2.4, -0.6],
      [0, 2.4, 0.6]
    ];

    containerPositions.forEach((position, index) => {
      createContainer(position[0], position[1], position[2], `container-${index + 1}`);
    });

    runtimeRef.current.executeCommand = (command, containerIdValue) => {
      const cube = dockerCubes.find((entry) => entry.userData.id === containerIdValue);

      if (!cube || statsRef.isGameOver) {
        return;
      }

      if (command === "restart") {
        const wasCrashed = cube.userData.state === "crashed";
        setContainerState(cube, "running");
        cube.scale.set(1.2, 1.2, 1.2);
        statsRef.commandCounts.restart += 1;

        if (wasCrashed) {
          statsRef.health = Math.min(100, statsRef.health + 6);
        }
      }

      if (command === "start") {
        setContainerState(cube, "running");
        cube.scale.set(1.15, 1.15, 1.15);
        statsRef.commandCounts.start += 1;
      }

      if (command === "stop") {
        setContainerState(cube, "stopped");
        statsRef.commandCounts.stop += 1;
      }

      if (command === "commit" && cube.userData.state === "running") {
        statsRef.score += 50;
        statsRef.commandCounts.commit += 1;
        cube.scale.set(1.28, 1.28, 1.28);
        cube.material.emissive.set("#00c853");
        cube.material.emissiveIntensity = 0.8;
      }

      emitStats();
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clock = new THREE.Clock();
    let lastCrashTime = 0;
    let crashInterval = 3.4;
    let statsElapsed = 0;

    function handleClick(event) {
      if (statsRef.isGameOver) {
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(dockerCubes, false);

      if (!hits.length) {
        clearHighlights();
        selectionRef.cubeId = "";
        callbacksRef.current.onSelectContainer?.(null);
        return;
      }

      const cube = hits[0].object;
      clearHighlights();
      cube.userData.isSelected = true;
      cube.userData.highlight.material.opacity = 0.8;
      updateSelectionMenu(cube, event.clientX, event.clientY);
    }

    function handleResize() {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      renderer.setSize(nextWidth, nextHeight);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    }

    renderer.domElement.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
    emitStats();

    let animationFrameId = 0;

    function animate(elapsedTime) {
      animationFrameId = window.requestAnimationFrame(animate);
      const delta = clock.getDelta();
      statsElapsed += delta;

      if (!callbacksRef.current.menuOpen) {
        camera.position.x = 11.2 + Math.sin(elapsedTime * 0.00045) * 1.35;
        camera.position.z = 15.2 + Math.cos(elapsedTime * 0.00045) * 1.35;
        camera.lookAt(0, -1.15, 0);
      }

      const waterPositions = water.geometry.attributes.position;
      for (let index = 0; index < waterPositions.count; index += 1) {
        const x = waterPositions.getX(index);
        const y = waterPositions.getY(index);
        const waveOffset =
          Math.sin(x * 0.2 + elapsedTime * 0.0018) * 0.28 +
          Math.cos(y * 0.2 + elapsedTime * 0.0018) * 0.28;
        waterPositions.setZ(index, waveOffset);
      }
      waterPositions.needsUpdate = true;

      whaleGroup.position.y = -1.35 + Math.sin(elapsedTime * 0.0018) * 0.45;
      whaleGroup.rotation.x = Math.sin(elapsedTime * 0.001) * 0.05;
      whaleGroup.rotation.z = Math.sin(elapsedTime * 0.0013) * 0.02;
      tailGroup.rotation.y = Math.sin(elapsedTime * 0.0048) * 0.25;

      if (!statsRef.isGameOver) {
        const running = dockerCubes.filter((cube) => cube.userData.state === "running");
        const crashed = dockerCubes.filter((cube) => cube.userData.state === "crashed");

        statsRef.score += running.length * delta * 3.2;
        statsRef.health -= crashed.length * delta * 5.6;

        if (crashed.length) {
          dangerLight.intensity = Math.min(3, crashed.length * 0.45) + Math.sin(elapsedTime * 0.01);
        } else {
          dangerLight.intensity = 0;
        }

        if (statsRef.health <= 0) {
          statsRef.health = 0;
          statsRef.isGameOver = true;
        }

        if (clock.elapsedTime - lastCrashTime > crashInterval) {
          lastCrashTime = clock.elapsedTime;
          crashInterval = Math.max(1.2, crashInterval - 0.08);

          if (running.length) {
            const victim = running[Math.floor(Math.random() * running.length)];
            setContainerState(victim, "crashed");
          }
        }
      }

      dockerCubes.forEach((cube) => {
        if (cube.scale.x > 1) {
          cube.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }

        if (cube.userData.state === "crashed") {
          cube.material.emissive.set("#8b0000");
          cube.material.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 0.01) * 0.45;
        } else if (cube.userData.state !== "running") {
          cube.material.emissiveIntensity = 0;
        } else {
          cube.material.emissiveIntensity *= 0.88;
        }
      });

      if (statsElapsed >= 0.2) {
        statsElapsed = 0;
        emitStats();
      }

      if (statsRef.isGameOver && !statsRef.gameOverSent) {
        statsRef.gameOverSent = true;
        callbacksRef.current.onGameOver?.({
          score: Math.floor(statsRef.score),
          health: 0,
          ...getCounts(),
          commandCounts: { ...statsRef.commandCounts }
        });
      }

      renderer.render(scene, camera);
    }

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleClick);

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [gameId]);

  return <div ref={mountRef} className="fleet-canvas" />;
}

export default GameScenePlaceholder;
