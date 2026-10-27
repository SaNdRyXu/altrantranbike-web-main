/**
 * ALTRANTRAN BIKE - 3D Mountain Bike Experience
 * Procedural High-Detail Three.js Interactive MTB Model
 * Real 3D geometry with PBR materials in brand sports palette:
 * Carbon Black / Sports Red / Electric Mint / Alloy Titanium
 */

(function () {
  'use strict';

  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  const container = document.getElementById('bike-3d-canvas-container');
  if (!container || !isWebGLAvailable()) {
    console.info('3D canvas container not found or WebGL not supported, fallback active.');
    return;
  }

  function init3DBike() {
    if (typeof THREE === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => buildScene();
      script.onerror = () => {
        console.warn('Failed to load Three.js CDN, showing visual fallback.');
      };
      document.head.appendChild(script);
    } else {
      buildScene();
    }
  }

  function buildScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.045);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.8, 1.4, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x1a2230, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00e5a3, 2.2);
    keyLight.position.set(4, 5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff2a2a, 2.8);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.4);
    topLight.position.set(0, 6, 1);
    scene.add(topLight);

    const underGlow = new THREE.PointLight(0x00e5a3, 1.5, 6);
    underGlow.position.set(0, 0.2, 0);
    scene.add(underGlow);

    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x05070a,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);

    const ringGeo = new THREE.RingGeometry(1.6, 2.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5a3,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    const outerRingGeo = new THREE.RingGeometry(2.7, 2.75, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xff2a2a,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.005;
    scene.add(outerRing);

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x0e131b,
      metalness: 0.85,
      roughness: 0.22
    });

    const redSportMat = new THREE.MeshStandardMaterial({
      color: 0xff2a2a,
      metalness: 0.7,
      roughness: 0.25,
      emissive: 0x330000
    });

    const mintDecalMat = new THREE.MeshStandardMaterial({
      color: 0x00e5a3,
      metalness: 0.75,
      roughness: 0.2,
      emissive: 0x002418
    });

    const alloyMat = new THREE.MeshStandardMaterial({
      color: 0x9eabb8,
      metalness: 0.9,
      roughness: 0.28
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd8e4ed,
      metalness: 0.98,
      roughness: 0.12
    });

    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x16181b,
      metalness: 0.08,
      roughness: 0.88
    });

    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x2b313a,
      metalness: 0.85,
      roughness: 0.4
    });

    const saddleMat = new THREE.MeshStandardMaterial({
      color: 0x181c22,
      metalness: 0.2,
      roughness: 0.65
    });

    function createTube(p1, p2, radius, material, radialSegments = 16) {
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const geom = new THREE.CylinderGeometry(radius, radius, len, radialSegments);
      const mesh = new THREE.Mesh(geom, material);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return mesh;
    }

    const bike = new THREE.Group();
    scene.add(bike);

    const BB = new THREE.Vector3(-0.08, 0.62, 0);
    const SEAT_J = new THREE.Vector3(-0.46, 1.16, 0);
    const SEAT_TOP = new THREE.Vector3(-0.52, 1.34, 0);
    const HEAD_TOP = new THREE.Vector3(0.82, 1.44, 0);
    const HEAD_BOT = new THREE.Vector3(0.76, 1.28, 0);
    const REAR_AXLE = new THREE.Vector3(-1.38, 0.62, 0);
    const FRONT_AXLE = new THREE.Vector3(1.36, 0.62, 0);

    bike.add(createTube(HEAD_BOT, BB, 0.046, carbonMat, 24));
    bike.add(createTube(
      new THREE.Vector3().lerpVectors(HEAD_BOT, BB, 0.25),
      new THREE.Vector3().lerpVectors(HEAD_BOT, BB, 0.75),
      0.048,
      redSportMat,
      24
    ));

    bike.add(createTube(HEAD_TOP, SEAT_J, 0.038, carbonMat, 20));
    bike.add(createTube(
      new THREE.Vector3().lerpVectors(HEAD_TOP, SEAT_J, 0.35),
      new THREE.Vector3().lerpVectors(HEAD_TOP, SEAT_J, 0.75),
      0.039,
      mintDecalMat,
      20
    ));

    bike.add(createTube(BB, SEAT_TOP, 0.036, carbonMat, 20));
    bike.add(createTube(HEAD_BOT, HEAD_TOP, 0.052, carbonMat, 24));

    const bbShell = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.14, 20), alloyMat);
    bbShell.rotation.x = Math.PI / 2;
    bbShell.position.copy(BB);
    bike.add(bbShell);

    const stayOffsets = [0.075, -0.075];
    stayOffsets.forEach(zOffset => {
      const bbStay = new THREE.Vector3(BB.x, BB.y, zOffset * 0.7);
      const axleStay = new THREE.Vector3(REAR_AXLE.x, REAR_AXLE.y, zOffset);
      bike.add(createTube(bbStay, axleStay, 0.024, carbonMat, 16));

      const seatStayJ = new THREE.Vector3(SEAT_J.x, SEAT_J.y, zOffset * 0.6);
      bike.add(createTube(seatStayJ, axleStay, 0.020, carbonMat, 16));

      const dropout = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.016), alloyMat);
      dropout.position.set(REAR_AXLE.x, REAR_AXLE.y, zOffset);
      bike.add(dropout);
    });

    const postTop = new THREE.Vector3(-0.62, 1.58, 0);
    bike.add(createTube(SEAT_TOP, postTop, 0.022, chromeMat, 16));

    const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.05), alloyMat);
    clamp.position.copy(postTop);
    bike.add(clamp);

    const saddleGroup = new THREE.Group();
    const saddleShape = new THREE.BoxGeometry(0.32, 0.05, 0.15);
    const saddle = new THREE.Mesh(saddleShape, saddleMat);
    saddle.position.set(-0.06, 0.03, 0);
    saddleGroup.add(saddle);

    const noseGeo = new THREE.ConeGeometry(0.07, 0.16, 12);
    const nose = new THREE.Mesh(noseGeo, saddleMat);
    nose.rotation.z = Math.PI / 2;
    nose.position.set(0.12, 0.025, 0);
    saddleGroup.add(nose);

    const saddleStripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.052, 0.152), redSportMat);
    saddleStripe.position.set(-0.18, 0.03, 0);
    saddleGroup.add(saddleStripe);

    saddleGroup.position.copy(postTop);
    saddleGroup.rotation.z = 0.08;
    bike.add(saddleGroup);

    const forkAngle = Math.atan2(HEAD_TOP.x - HEAD_BOT.x, HEAD_TOP.y - HEAD_BOT.y);
    const crownPos = new THREE.Vector3().copy(HEAD_BOT).add(new THREE.Vector3(0.04, -0.07, 0));

    const crown = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.19), mintDecalMat);
    crown.position.copy(crownPos);
    crown.rotation.z = -forkAngle;
    bike.add(crown);

    const forkOffsets = [0.072, -0.072];
    forkOffsets.forEach(z => {
      const topStanchion = new THREE.Vector3(crownPos.x, crownPos.y, z);
      const midStanchion = new THREE.Vector3().lerpVectors(topStanchion, new THREE.Vector3(FRONT_AXLE.x, FRONT_AXLE.y, z), 0.45);
      const axlePoint = new THREE.Vector3(FRONT_AXLE.x, FRONT_AXLE.y, z);

      bike.add(createTube(topStanchion, midStanchion, 0.022, chromeMat, 16));
      bike.add(createTube(midStanchion, axlePoint, 0.028, mintDecalMat, 18));
    });

    const archPos = new THREE.Vector3().lerpVectors(crownPos, FRONT_AXLE, 0.52);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 12, 24, Math.PI), mintDecalMat);
    arch.position.set(archPos.x, archPos.y + 0.02, 0);
    arch.rotation.y = Math.PI / 2;
    arch.rotation.x = -forkAngle;
    bike.add(arch);

    const stemPos = new THREE.Vector3().copy(HEAD_TOP).add(new THREE.Vector3(0.06, 0.04, 0));
    bike.add(createTube(HEAD_TOP, stemPos, 0.03, alloyMat, 16));

    const barGeo = new THREE.CylinderGeometry(0.020, 0.020, 0.88, 20);
    const handlebar = new THREE.Mesh(barGeo, carbonMat);
    handlebar.rotation.x = Math.PI / 2;
    handlebar.position.copy(stemPos);
    bike.add(handlebar);

    const gripOffsets = [0.38, -0.38];
    gripOffsets.forEach(z => {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.14, 16), rubberMat);
      grip.rotation.x = Math.PI / 2;
      grip.position.set(stemPos.x - 0.01, stemPos.y, z);
      bike.add(grip);

      const lever = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.018), alloyMat);
      lever.position.set(stemPos.x + 0.06, stemPos.y - 0.02, z * 0.75);
      lever.rotation.z = -0.4;
      bike.add(lever);
    });

    function buildWheel(isRear = false) {
      const wheel = new THREE.Group();
      const wheelRadius = 0.62;
      const rimRadius = 0.48;

      const tireGeo = new THREE.TorusGeometry(rimRadius + 0.08, 0.068, 24, 64);
      const tire = new THREE.Mesh(tireGeo, rubberMat);
      wheel.add(tire);

      const knobGeo = new THREE.BoxGeometry(0.028, 0.024, 0.04);
      for (let i = 0; i < 48; i++) {
        const theta = (i / 48) * Math.PI * 2;
        const knob = new THREE.Mesh(knobGeo, rubberMat);
        const r = rimRadius + 0.145;
        knob.position.set(Math.cos(theta) * r, Math.sin(theta) * r, 0);
        knob.rotation.z = theta;
        wheel.add(knob);
      }

      const rimGeo = new THREE.TorusGeometry(rimRadius, 0.028, 16, 64);
      const rim = new THREE.Mesh(rimGeo, carbonMat);
      wheel.add(rim);

      const decalGeo1 = new THREE.TorusGeometry(rimRadius, 0.030, 8, 16, Math.PI / 3);
      const decal1 = new THREE.Mesh(decalGeo1, mintDecalMat);
      decal1.rotation.z = Math.PI / 6;
      wheel.add(decal1);

      const decalGeo2 = new THREE.TorusGeometry(rimRadius, 0.030, 8, 16, Math.PI / 3);
      const decal2 = new THREE.Mesh(decalGeo2, redSportMat);
      decal2.rotation.z = Math.PI + Math.PI / 6;
      wheel.add(decal2);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.12, 16), alloyMat);
      hub.rotation.x = Math.PI / 2;
      wheel.add(hub);

      const spokeMat = new THREE.LineBasicMaterial({ color: 0x8894a0, transparent: true, opacity: 0.65 });
      const spokeGeo = new THREE.BufferGeometry();
      const spokePositions = [];
      const numSpokes = 32;

      for (let s = 0; s < numSpokes; s++) {
        const angle = (s / numSpokes) * Math.PI * 2;
        const side = s % 2 === 0 ? 0.045 : -0.045;
        const hubX = Math.cos(angle) * 0.034;
        const hubY = Math.sin(angle) * 0.034;
        const rimAngle = angle + (s % 2 === 0 ? 0.25 : -0.25);
        const rimX = Math.cos(rimAngle) * rimRadius;
        const rimY = Math.sin(rimAngle) * rimRadius;

        spokePositions.push(hubX, hubY, side);
        spokePositions.push(rimX, rimY, 0);
      }
      spokeGeo.setAttribute('position', new THREE.Float32BufferAttribute(spokePositions, 3));
      const spokes = new THREE.LineSegments(spokeGeo, spokeMat);
      wheel.add(spokes);

      const rotorGeo = new THREE.RingGeometry(0.06, 0.14, 32);
      const rotor = new THREE.Mesh(rotorGeo, chromeMat);
      rotor.position.z = 0.052;
      wheel.add(rotor);

      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.04), redSportMat);
      caliper.position.set(-0.11, 0.08, 0.054);
      wheel.add(caliper);

      if (isRear) {
        const cassetteGroup = new THREE.Group();
        for (let c = 0; c < 8; c++) {
          const cR = 0.05 + c * 0.015;
          const cog = new THREE.Mesh(new THREE.CylinderGeometry(cR, cR, 0.006, 24), chromeMat);
          cog.rotation.x = Math.PI / 2;
          cog.position.z = -0.025 - c * 0.007;
          cassetteGroup.add(cog);
        }
        wheel.add(cassetteGroup);
      }

      return wheel;
    }

    const rearWheel = buildWheel(true);
    rearWheel.position.copy(REAR_AXLE);
    bike.add(rearWheel);

    const frontWheel = buildWheel(false);
    frontWheel.position.copy(FRONT_AXLE);
    bike.add(frontWheel);

    const chainring = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.008, 32), darkSteelMat);
    chainring.rotation.x = Math.PI / 2;
    chainring.position.set(BB.x, BB.y, -0.06);
    bike.add(chainring);

    const crankL = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.22, 0.018), alloyMat);
    crankL.position.set(BB.x + 0.05, BB.y - 0.08, 0.08);
    crankL.rotation.z = 0.4;
    bike.add(crankL);

    const pedalL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.024, 0.10), redSportMat);
    pedalL.position.set(BB.x + 0.09, BB.y - 0.17, 0.12);
    bike.add(pedalL);

    const crankR = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.22, 0.018), alloyMat);
    crankR.position.set(BB.x - 0.05, BB.y + 0.08, -0.08);
    crankR.rotation.z = 0.4;
    bike.add(crankR);

    const pedalR = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.024, 0.10), mintDecalMat);
    pedalR.position.set(BB.x - 0.09, BB.y + 0.17, -0.12);
    bike.add(pedalR);

    const rdBody = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.06), darkSteelMat);
    rdBody.position.set(REAR_AXLE.x + 0.08, REAR_AXLE.y - 0.12, -0.075);
    bike.add(rdBody);

    const chainTop = createTube(
      new THREE.Vector3(BB.x, BB.y + 0.10, -0.06),
      new THREE.Vector3(REAR_AXLE.x, REAR_AXLE.y + 0.08, -0.05),
      0.008,
      darkSteelMat,
      8
    );
    bike.add(chainTop);

    const chainBot = createTube(
      new THREE.Vector3(BB.x, BB.y - 0.10, -0.06),
      new THREE.Vector3(REAR_AXLE.x + 0.08, REAR_AXLE.y - 0.14, -0.06),
      0.008,
      darkSteelMat,
      8
    );
    bike.add(chainBot);

    bike.position.set(0, 0.05, 0);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0.35;
    let targetRotX = 0.05;
    let currentRotY = 0.35;
    let currentRotX = 0.05;
    let autoRotate = true;
    let rotationSpeed = 0.005;

    function onPointerDown(e) {
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      prevMouseX = clientX;
      prevMouseY = clientY;
      autoRotate = false;
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.005;
      targetRotX = Math.max(-0.25, Math.min(0.35, targetRotX));
    }

    function onPointerUp() {
      isDragging = false;
      clearTimeout(window.__bikeResumeTimeout);
      window.__bikeResumeTimeout = setTimeout(() => {
        autoRotate = true;
      }, 4000);
    }

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('mousedown', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp, { passive: true });

    canvasElem.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    const btnPerspective = document.getElementById('view-perspective');
    const btnSide = document.getElementById('view-side');
    const btnFront = document.getElementById('view-front');
    const btnRotateToggle = document.getElementById('toggle-rotate');

    function animateCameraTo(targetPos, targetLookAt) {
      const startPos = camera.position.clone();
      const startTime = performance.now();
      const duration = 1000;

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        camera.position.lerpVectors(startPos, targetPos, ease);
        camera.lookAt(targetLookAt);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (btnPerspective) {
      btnPerspective.addEventListener('click', () => {
        targetRotY = 0.35;
        targetRotX = 0.05;
        animateCameraTo(new THREE.Vector3(2.8, 1.4, 3.2), new THREE.Vector3(0, 0.85, 0));
      });
    }

    if (btnSide) {
      btnSide.addEventListener('click', () => {
        targetRotY = 0;
        targetRotX = 0;
        animateCameraTo(new THREE.Vector3(0, 1.0, 4.2), new THREE.Vector3(0, 0.85, 0));
      });
    }

    if (btnFront) {
      btnFront.addEventListener('click', () => {
        targetRotY = Math.PI / 2;
        targetRotX = 0.08;
        animateCameraTo(new THREE.Vector3(3.8, 1.3, 0), new THREE.Vector3(0, 0.85, 0));
      });
    }

    if (btnRotateToggle) {
      btnRotateToggle.addEventListener('click', () => {
        autoRotate = !autoRotate;
        btnRotateToggle.classList.toggle('active', autoRotate);
      });
    }

    const hotspots = [
      { id: 'spot-frame', pos: new THREE.Vector3(0.1, 1.1, 0), title: 'Cuadro Carbon/Alu Hydroformed', desc: 'Geometría trail progresiva con ángulo de dirección relajado para máxima estabilidad.' },
      { id: 'spot-fork', pos: new THREE.Vector3(1.1, 1.1, 0), title: 'Horquilla 120mm', desc: 'Suspensión neumática con bloqueo remoto y tacto sensible en trialeras.' },
      { id: 'spot-drivetrain', pos: new THREE.Vector3(-0.08, 0.62, -0.06), title: 'Transmisión 1x12', desc: 'Monoplato y cassette 10-52T para subir cualquier pendiente con suavidad.' },
      { id: 'spot-brakes', pos: new THREE.Vector3(-1.38, 0.62, 0.06), title: 'Frenos Hidráulicos', desc: 'Discos de 180/160mm con mordida progresiva para descensos con total control.' },
      { id: 'spot-wheels', pos: new THREE.Vector3(1.36, 0.62, 0), title: 'Ruedas 29" Tubeless Ready', desc: 'Cubiertas de 2.35" con taqueado agresivo y sellante antipinchazos.' }
    ];

    const hotspotContainer = document.getElementById('bike-hotspots');
    if (hotspotContainer) {
      hotspots.forEach(spot => {
        const pin = document.createElement('button');
        pin.className = 'hotspot-pin';
        pin.id = spot.id;
        pin.setAttribute('aria-label', spot.title);
        pin.innerHTML = `
          <span class="pin-pulse"></span>
          <span class="pin-dot"></span>
          <div class="pin-tooltip">
            <h4>${spot.title}</h4>
            <p>${spot.desc}</p>
          </div>
        `;
        hotspotContainer.appendChild(pin);
      });
    }

    function updateHotspots() {
      if (!hotspotContainer) return;
      hotspots.forEach(spot => {
        const pin = document.getElementById(spot.id);
        if (!pin) return;
        const worldPos = spot.pos.clone().applyEuler(bike.rotation).add(bike.position);
        worldPos.project(camera);

        const isBehind = worldPos.z > 1;
        if (isBehind) {
          pin.style.display = 'none';
          return;
        }

        const x = (worldPos.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
        const y = (-(worldPos.y * 0.5) + 0.5) * renderer.domElement.clientHeight;

        pin.style.display = 'block';
        pin.style.left = `${x}px`;
        pin.style.top = `${y}px`;
      });
    }

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    function onResize() {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    let lastTime = 0;
    function render(time) {
      requestAnimationFrame(render);
      if (!isVisible) return;

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      if (autoRotate && !isDragging) {
        targetRotY += rotationSpeed;
      }

      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;

      bike.rotation.y = currentRotY;
      bike.rotation.x = currentRotX;

      rearWheel.rotation.z -= 0.008;
      frontWheel.rotation.z -= 0.008;

      bike.position.y = 0.05 + Math.sin(time * 0.002) * 0.015;

      renderer.render(scene, camera);
      updateHotspots();
    }

    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DBike);
  } else {
    init3DBike();
  }
})();
