/**
 * ALTRANTRAN BIKE — 3D ORBEA OIZ VERDE MENTA EXPERIENCE
 * High-detail procedural full-suspension XC Mountain Bike model
 * Featuring iconic horizontal Fox i-line rear shock, Fiberlink rocker,
 * Kashima gold stanchions, Orbea Mint gloss finish & interactive
 * real-world MTB recommendations tailored for women riders.
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

  // Recommendations data tailored for women on real MTB rides
  const recommendationsData = {
    'spot-saddle': {
      tag: 'COMODIDAD & ERGONOMÍA',
      icon: 'fa-solid fa-person-biking',
      title: 'El Sillín y el Culotte: Tu mayor aliado',
      quote: '«El secreto que nadie te cuenta al empezar: ¡el culotte va SIEMPRE sin ropa interior!»',
      desc: 'La comodidad sobre la bici no depende de un sillín blando y acolchado, sino de un buen culotte con badana específica para mujer (diseñada para adaptarse a la pelvis femenina). Al no llevar ropa interior debajo, evitas costuras que produzcan rozaduras en rutas largas. Si notas molestias los primeros días, no te preocupes: los isquiones se acostumbran en 2 o 3 salidas.',
      tip: 'Consejo Altrantran: Si vas a comprar tu primer culotte, que sea de tu talla justa para que la badana no se mueva.'
    },
    'spot-cockpit': {
      tag: 'SEGURIDAD & CONTROL',
      icon: 'fa-solid fa-hand-dots',
      title: 'Guantes Largos y Gafas Deportivas',
      quote: '«Tus manos y tus ojos son tu conexión directa con el camino.»',
      desc: 'En montaña usamos siempre guantes largos, incluso en verano. Protegen tus manos si rozas ramas o zarzas, amortiguan las vibraciones del camino para que no se te duerman los dedos y te salvan de raspones si apoyas la mano en una parada. Las gafas (de sol o transparentes si está nublado) son imprescindibles para evitar que te entre polvo, mosquitos o piedrecillas.',
      tip: 'Consejo Altrantran: Elige guantes con almohadillas de gel en la palma para un agarre más descansado.'
    },
    'spot-bottle': {
      tag: 'HIDRATACIÓN & ENERGÍA',
      icon: 'fa-solid fa-bottle-water',
      title: 'Hidratación y Snacks para no desfallecer',
      quote: '«Bebe antes de tener sed y come antes de notar fatiga.»',
      desc: 'Lleva siempre un bidón de al menos 650-750 ml con agua o bebida isotónica. En bici se suda más de lo que parece por el viento; da pequeños sorbos cada 15-20 minutos. En el bolsillo del maillot lleva un snack que te guste (una barrita, frutos secos, gominolas o un plátano). Te dará ese empujón de energía en las subidas sin necesidad de parar a hacer comidas pesadas.',
      tip: 'Consejo Altrantran: Si hace calor, congela medio bidón de agua la noche anterior para que aguante fresca.'
    },
    'spot-pack': {
      tag: 'IMPRESCINDIBLES DE BOLSILLO',
      icon: 'fa-solid fa-bag-shopping',
      title: 'Bolsita de Sillín o Riñonera Ligera',
      quote: '«Lleva lo necesario para rodar tranquila, sin cargar con una mochila gigante.»',
      desc: 'Para una ruta MTB normal no necesitas mochilas de descenso pesadas. En una pequeña bolsita bajo el sillín o en una riñonera ligera lleva: un paquete de pañuelos de papel o toallitas (¡básico cuando toca parar detrás de un árbol!), cacao de labios con protección solar, una goma de pelo de repuesto, tu móvil cargado y el DNI o tarjeta sanitaria.',
      tip: 'Consejo Altrantran: Guarda el móvil en una bolsita hermética pequeña por si cruzas charcos o amenaza lluvia.'
    },
    'spot-wheels': {
      tag: 'MECÁNICA FÁCIL & APOYO',
      icon: 'fa-solid fa-compact-disc',
      title: 'Ruedas y Cero Agobios con la Mecánica',
      quote: '«No tienes que ser mecánica: en Altrantran jamás te quedarás tirada.»',
      desc: 'Muchas mujeres sienten reparo por si pinchan y no saben arreglarlo. En nuestro grupo siempre te ayudaremos y te enseñaremos si quieres aprender. Lo único que debes llevar es una cámara de repuesto de la medida de tus ruedas (26", 27.5" o 29") y dos desmontables de plástico. Si tu bici lleva líquido tubeless antipinchazos, ¡el 95% de los pinchazos se sellan solos al rodar!',
      tip: 'Consejo Altrantran: Comprueba la presión de las ruedas la tarde antes para que no salgas con la rueda blanda.'
    },
    'spot-helmet': {
      tag: 'PROTECCIÓN VITAL',
      icon: 'fa-solid fa-helmet-safety',
      title: 'Casco Homologado y Peinado Cómodo',
      quote: '«El casco no se negocia: bien ajustado y peinado cómodo.»',
      desc: 'El casco es 100% obligatorio. Debe colocarse recto sobre la frente (a dos dedos sobre las cejas), nunca inclinado hacia atrás. Un truco muy práctico para chicas con pelo largo: hazte una coleta baja o una trenza ladeada; de este modo el coletero queda por debajo de la rueda trasera de ajuste del casco y no te causará dolor de cabeza durante la ruta.',
      tip: 'Consejo Altrantran: Las correas laterales deben formar una "V" justo debajo de tus orejas.'
    },
    'spot-shock': {
      tag: 'FILOSOFÍA DE RUTA',
      icon: 'fa-solid fa-mountain-sun',
      title: 'Suspensión y Rutas Asequibles',
      quote: '«Salimos a disfrutar del campo y las risas, no a sufrir trialeras extremas.»',
      desc: 'La suspensión delantera y trasera de una bici como la Orbea Oiz absorbe los baches del camino para que tu espalda, lumbares y hombros no se carguen. Nuestras rutas por San Fernando de Henares, Coslada, el río Jarama y las vías verdes son tranquilas y preciosas. Vamos a charlar, respirar aire puro y hacer deporte en el mejor ambiente.',
      tip: 'Consejo Altrantran: Ante cualquier duda sobre el ritmo de una salida, pregúntanos antes y te orientamos.'
    }
  };

  function buildScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.04);

    const width = container.clientWidth || 850;
    const height = container.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(2.9, 1.35, 3.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- ILUMINACIÓN CINEMATOGRÁFICA DE ESTUDIO ---
    const ambientLight = new THREE.AmbientLight(0x18202c, 2.0);
    scene.add(ambientLight);

    // Key Light - Resalta el Verde Menta de Orbea
    const keyLight = new THREE.DirectionalLight(0x42f5bf, 2.4);
    keyLight.position.set(4, 5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Rim/Back Light - Perfilado deportivo en rojo y blanco
    const rimLight = new THREE.DirectionalLight(0xff2a2a, 2.2);
    rimLight.position.set(-4.5, 3.5, -3.5);
    scene.add(rimLight);

    // Soft Top Light para brillo de cuadro
    const topLight = new THREE.DirectionalLight(0xffffff, 1.6);
    topLight.position.set(0, 6, 1);
    scene.add(topLight);

    // Fill Light sutil desde el suelo
    const underGlow = new THREE.PointLight(0x2bd4a0, 1.8, 5);
    underGlow.position.set(0, 0.2, 0);
    scene.add(underGlow);

    // Suelo reflectante con degradado suave
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

    // Anillo topográfico bajo la bici
    const ringGeo = new THREE.RingGeometry(1.6, 2.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x2bd4a0,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // --- MATERIALES ORBEA OIZ VERDE MENTA ---
    // Color oficial Orbea Oiz Mint Green Gloss
    const orbeaMintMat = new THREE.MeshStandardMaterial({
      color: 0x36dfaf,
      metalness: 0.22,
      roughness: 0.18,
      emissive: 0x063324
    });

    // Carbono crudo oscuro para vainas y zona de pedalier
    const carbonRawMat = new THREE.MeshStandardMaterial({
      color: 0x11151c,
      metalness: 0.75,
      roughness: 0.32
    });

    // Kashima Gold original para barras Fox Float SC
    const kashimaGoldMat = new THREE.MeshStandardMaterial({
      color: 0xcda863,
      metalness: 0.94,
      roughness: 0.12
    });

    // Titanio / Aluminio pulido
    const alloyMat = new THREE.MeshStandardMaterial({
      color: 0xa8b4c0,
      metalness: 0.95,
      roughness: 0.22
    });

    // Acero oscuro para discos y piñonería
    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x313844,
      metalness: 0.88,
      roughness: 0.35
    });

    // Goma negra mate para neumáticos y puños
    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x16181b,
      metalness: 0.05,
      roughness: 0.92
    });

    // Sillín ergonómico de mujer
    const saddleMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e24,
      metalness: 0.15,
      roughness: 0.65
    });

    // Bidón verde menta Altrantran
    const bottleMat = new THREE.MeshStandardMaterial({
      color: 0x48e5b5,
      metalness: 0.1,
      roughness: 0.35
    });

    // Acento rojo deportivo Altrantran
    const sportRedMat = new THREE.MeshStandardMaterial({
      color: 0xff2a2a,
      metalness: 0.6,
      roughness: 0.25,
      emissive: 0x330000
    });

    function createTube(p1, p2, radius, material, radialSegments = 20) {
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const geom = new THREE.CylinderGeometry(radius, radius, len, radialSegments);
      const mesh = new THREE.Mesh(geom, material);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return mesh;
    }

    // --- CONSTRUCCIÓN GEOMÉTRICA DE LA ORBEA OIZ XC ---
    const bike = new THREE.Group();
    scene.add(bike);

    // Puntos anatómicos Orbea Oiz (Talla M / 29 pulgadas)
    const BB = new THREE.Vector3(-0.06, 0.63, 0);          // Eje de pedalier
    const HEAD_TOP = new THREE.Vector3(0.86, 1.42, 0);    // Pipa dirección superior
    const HEAD_BOT = new THREE.Vector3(0.80, 1.25, 0);    // Pipa dirección inferior
    const SEAT_JUNCTION = new THREE.Vector3(-0.48, 1.14, 0); // Unión tubo sillín y horizontal
    const SEAT_TOP = new THREE.Vector3(-0.55, 1.35, 0);   // Cierre tija
    const REAR_AXLE = new THREE.Vector3(-1.38, 0.63, 0);  // Eje rueda trasera
    const FRONT_AXLE = new THREE.Vector3(1.36, 0.63, 0);  // Eje rueda delantera
    const SHOCK_FRONT = new THREE.Vector3(0.48, 1.28, 0); // Anclaje frontal amortiguador Oiz
    const FIBERLINK_PIVOT = new THREE.Vector3(-0.46, 1.16, 0); // Bieleta Fiberlink

    // 1. CUADRO PRINCIPAL (MONOCASCO ORBEA OIZ MINT)
    // Tubo diagonal hidroformado masivo (Mint Green)
    bike.add(createTube(HEAD_BOT, BB, 0.052, orbeaMintMat, 24));

    // Franja inferior de carbono visto en el diagonal
    bike.add(createTube(
      new THREE.Vector3().lerpVectors(HEAD_BOT, BB, 0.6),
      BB,
      0.053,
      carbonRawMat,
      24
    ));

    // Tubo superior sloping característico de Orbea Oiz
    bike.add(createTube(HEAD_TOP, SEAT_JUNCTION, 0.038, orbeaMintMat, 20));

    // Tubo de sillín
    bike.add(createTube(BB, SEAT_TOP, 0.036, orbeaMintMat, 20));

    // Pipa de dirección cónica (Head tube)
    bike.add(createTube(HEAD_BOT, HEAD_TOP, 0.055, orbeaMintMat, 24));

    // Caja de pedalier BB92
    const bbShell = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.15, 24), carbonRawMat);
    bbShell.rotation.x = Math.PI / 2;
    bbShell.position.copy(BB);
    bike.add(bbShell);

    // 2. AMORTIGUADOR HORIZONTAL FOX I-LINE (ICONO DE LA ORBEA OIZ)
    // El amortiguador de la Oiz se sitúa suspendido horizontalmente bajo el tubo superior
    const shockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.22, 20), alloyMat);
    shockBody.rotation.z = Math.PI / 2 - 0.12;
    shockBody.position.set(0.12, 1.24, 0);
    bike.add(shockBody);

    // Vástago Kashima Gold del amortiguador
    const shockStanchion = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.14, 20), kashimaGoldMat);
    shockStanchion.rotation.z = Math.PI / 2 - 0.12;
    shockStanchion.position.set(-0.04, 1.22, 0);
    bike.add(shockStanchion);

    // Bloqueo remoto y dial i-line
    const shockDial = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 12), sportRedMat);
    shockDial.position.set(0.24, 1.27, 0.025);
    bike.add(shockDial);

    // 3. BIELETA FIBERLINK DE CARBONO
    // Bieleta triangular ultraligera que empuja el amortiguador en la Oiz
    const fiberlink = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.11), carbonRawMat);
    fiberlink.position.set(-0.24, 1.20, 0);
    fiberlink.rotation.z = 0.35;
    bike.add(fiberlink);

    // 4. TRIÁNGULO TRASERO UFO (FLEX-STAYS SIN PIVOTE TRASERO)
    const stayOffsets = [0.076, -0.076];
    stayOffsets.forEach(zOffset => {
      // Vainas inferiores desde el pedalier al eje trasero (Carbono negro)
      const bbStay = new THREE.Vector3(BB.x, BB.y, zOffset * 0.75);
      const axleStay = new THREE.Vector3(REAR_AXLE.x, REAR_AXLE.y, zOffset);
      bike.add(createTube(bbStay, axleStay, 0.026, carbonRawMat, 16));

      // Tirantes superiores que conectan con la Fiberlink (Verde menta y carbono)
      const linkStay = new THREE.Vector3(-0.28, 1.18, zOffset * 0.65);
      bike.add(createTube(linkStay, axleStay, 0.022, orbeaMintMat, 16));

      // Puntera trasera con eje pasante de 12mm
      const dropout = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.02), carbonRawMat);
      dropout.position.set(REAR_AXLE.x, REAR_AXLE.y, zOffset);
      bike.add(dropout);
    });

    // Protector de vaina de goma para evitar ruidos de cadena
    const stayProtector = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 12), rubberMat);
    stayProtector.rotation.z = 0.1;
    stayProtector.position.set(-0.75, 0.64, -0.076);
    bike.add(stayProtector);

    // 5. PORTABIDÓN Y BIDÓN ALTRANTRAN EN EL DIAGONAL
    const cagePos = new THREE.Vector3().lerpVectors(HEAD_BOT, BB, 0.45);
    const bottleCage = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.07), carbonRawMat);
    bottleCage.position.set(cagePos.x + 0.04, cagePos.y + 0.04, 0);
    bottleCage.rotation.z = Math.atan2(HEAD_BOT.y - BB.y, HEAD_BOT.x - BB.x);
    bike.add(bottleCage);

    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.24, 16), bottleMat);
    bottle.position.set(cagePos.x + 0.07, cagePos.y + 0.08, 0);
    bottle.rotation.z = bottleCage.rotation.z;
    bike.add(bottle);

    // Tapón rojo del bidón
    const bottleCap = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.04, 16), sportRedMat);
    bottleCap.position.set(cagePos.x + 0.01, cagePos.y + 0.19, 0);
    bottleCap.rotation.z = bottleCage.rotation.z;
    bike.add(bottleCap);

    // 6. SILLÍN ERGONÓMICO DE MUJER Y TIJA TELESCÓPICA
    const postTop = new THREE.Vector3(-0.64, 1.58, 0);
    // Tija hidráulica Kashima
    bike.add(createTube(SEAT_TOP, postTop, 0.022, kashimaGoldMat, 16));

    // Abrazadera del sillín
    const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.05), alloyMat);
    clamp.position.copy(postTop);
    bike.add(clamp);

    // Sillín de mujer (más ancho en isquiones, canal antiprostático/alivio pélvico)
    const saddleGroup = new THREE.Group();
    const saddleBase = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.045, 0.165), saddleMat);
    saddleBase.position.set(-0.06, 0.03, 0);
    saddleGroup.add(saddleBase);

    // Punta del sillín
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.15, 16), saddleMat);
    nose.rotation.z = Math.PI / 2;
    nose.position.set(0.11, 0.025, 0);
    saddleGroup.add(nose);

    // Canal central de alivio
    const reliefChannel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.04), carbonRawMat);
    reliefChannel.position.set(0.01, 0.045, 0);
    saddleGroup.add(reliefChannel);

    // Detalle mint green en el borde trasero
    const saddleDecal = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.046, 0.166), orbeaMintMat);
    saddleDecal.position.set(-0.19, 0.03, 0);
    saddleGroup.add(saddleDecal);

    // Bolsita compacta bajo el sillín
    const saddleBag = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.10), carbonRawMat);
    saddleBag.position.set(-0.14, -0.04, 0);
    saddleGroup.add(saddleBag);

    saddleGroup.position.copy(postTop);
    saddleGroup.rotation.z = 0.06;
    bike.add(saddleGroup);

    // 7. HORQUILLA FOX FLOAT STEP-CAST 34 (BARRAS KASHIMA + BOTELLAS MINT)
    const forkAngle = Math.atan2(HEAD_TOP.x - HEAD_BOT.x, HEAD_TOP.y - HEAD_BOT.y);
    const crownPos = new THREE.Vector3().copy(HEAD_BOT).add(new THREE.Vector3(0.04, -0.06, 0));

    // Corona de la horquilla (Carbono negro)
    const crown = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.048, 0.19), carbonRawMat);
    crown.position.copy(crownPos);
    crown.rotation.z = -forkAngle;
    bike.add(crown);

    const forkOffsets = [0.074, -0.074];
    forkOffsets.forEach(z => {
      const topStanchion = new THREE.Vector3(crownPos.x, crownPos.y, z);
      const midStanchion = new THREE.Vector3().lerpVectors(topStanchion, new THREE.Vector3(FRONT_AXLE.x, FRONT_AXLE.y, z), 0.44);
      const axlePoint = new THREE.Vector3(FRONT_AXLE.x, FRONT_AXLE.y, z);

      // Barras superiores Fox SC en Kashima Gold
      bike.add(createTube(topStanchion, midStanchion, 0.023, kashimaGoldMat, 18));

      // Botellas inferiores en acabado Verde Menta Orbea
      bike.add(createTube(midStanchion, axlePoint, 0.029, orbeaMintMat, 20));
    });

    // Puente de la horquilla que une las botellas
    const archPos = new THREE.Vector3().lerpVectors(crownPos, FRONT_AXLE, 0.52);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.018, 12, 24, Math.PI), orbeaMintMat);
    arch.position.set(archPos.x, archPos.y + 0.02, 0);
    arch.rotation.y = Math.PI / 2;
    arch.rotation.x = -forkAngle;
    bike.add(arch);

    // 8. COCKPIT XC (MANILLAR PLANO, POTENCIA INTEGRADA, PUÑOS Y MANDO SQUIDLOCK)
    const stemPos = new THREE.Vector3().copy(HEAD_TOP).add(new THREE.Vector3(0.05, 0.03, 0));
    bike.add(createTube(HEAD_TOP, stemPos, 0.028, carbonRawMat, 16));

    // Manillar plano XC de 760mm
    const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.82, 20), carbonRawMat);
    handlebar.rotation.x = Math.PI / 2;
    handlebar.position.copy(stemPos);
    bike.add(handlebar);

    // Puños de silicona y manetas
    const gripOffsets = [0.35, -0.35];
    gripOffsets.forEach(z => {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.13, 16), rubberMat);
      grip.rotation.x = Math.PI / 2;
      grip.position.set(stemPos.x - 0.01, stemPos.y, z);
      bike.add(grip);

      // Maneta de freno hidráulico
      const lever = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.014, 0.016), alloyMat);
      lever.position.set(stemPos.x + 0.05, stemPos.y - 0.02, z * 0.78);
      lever.rotation.z = -0.35;
      bike.add(lever);
    });

    // Mando remoto Squidlock (bloqueo simultáneo de amortiguador y horquilla en el manillar)
    const squidlock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.04), sportRedMat);
    squidlock.position.set(stemPos.x + 0.02, stemPos.y + 0.025, 0.16);
    bike.add(squidlock);

    // 9. RUEDAS 29" OQUO MOUNTAIN PERFORMANCE CON CUBIERTAS MAXXIS XC
    function buildXCWheel(isRear = false) {
      const wheel = new THREE.Group();
      const rimRadius = 0.49;

      // Cubierta Maxxis Rekon Race (Perfil ancho con balón 2.35")
      const tireGeo = new THREE.TorusGeometry(rimRadius + 0.08, 0.065, 24, 64);
      const tire = new THREE.Mesh(tireGeo, rubberMat);
      wheel.add(tire);

      // Taqueado exterior agresivo
      const knobGeo = new THREE.BoxGeometry(0.025, 0.022, 0.036);
      for (let i = 0; i < 52; i++) {
        const theta = (i / 52) * Math.PI * 2;
        const knob = new THREE.Mesh(knobGeo, rubberMat);
        const r = rimRadius + 0.14;
        knob.position.set(Math.cos(theta) * r, Math.sin(theta) * r, 0);
        knob.rotation.z = theta;
        wheel.add(knob);
      }

      // Llanta de carbono Oquo MP30
      const rimGeo = new THREE.TorusGeometry(rimRadius, 0.026, 16, 64);
      const rim = new THREE.Mesh(rimGeo, carbonRawMat);
      wheel.add(rim);

      // Adhesivos de llanta en verde menta Orbea Oiz
      const decalGeo1 = new THREE.TorusGeometry(rimRadius, 0.028, 8, 16, Math.PI / 3.5);
      const decal1 = new THREE.Mesh(decalGeo1, orbeaMintMat);
      decal1.rotation.z = Math.PI / 4;
      wheel.add(decal1);

      const decalGeo2 = new THREE.TorusGeometry(rimRadius, 0.028, 8, 16, Math.PI / 3.5);
      const decal2 = new THREE.Mesh(decalGeo2, orbeaMintMat);
      decal2.rotation.z = Math.PI + Math.PI / 4;
      wheel.add(decal2);

      // Buje central
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.12, 16), alloyMat);
      hub.rotation.x = Math.PI / 2;
      wheel.add(hub);

      // 32 Radios de acero cruzados
      const spokeMat = new THREE.LineBasicMaterial({ color: 0x8a97a4, transparent: true, opacity: 0.7 });
      const spokeGeo = new THREE.BufferGeometry();
      const spokePositions = [];
      const numSpokes = 32;

      for (let s = 0; s < numSpokes; s++) {
        const angle = (s / numSpokes) * Math.PI * 2;
        const side = s % 2 === 0 ? 0.042 : -0.042;
        const hubX = Math.cos(angle) * 0.032;
        const hubY = Math.sin(angle) * 0.032;
        const rimAngle = angle + (s % 2 === 0 ? 0.22 : -0.22);
        const rimX = Math.cos(rimAngle) * rimRadius;
        const rimY = Math.sin(rimAngle) * rimRadius;

        spokePositions.push(hubX, hubY, side);
        spokePositions.push(rimX, rimY, 0);
      }
      spokeGeo.setAttribute('position', new THREE.Float32BufferAttribute(spokePositions, 3));
      wheel.add(new THREE.LineSegments(spokeGeo, spokeMat));

      // Disco de freno perforado Shimano Deore/XT (180mm del / 160mm tras)
      const rotorRadius = isRear ? 0.13 : 0.145;
      const rotorGeo = new THREE.RingGeometry(0.055, rotorRadius, 32);
      const rotor = new THREE.Mesh(rotorGeo, alloyMat);
      rotor.position.z = 0.054;
      wheel.add(rotor);

      // Pinza de freno hidráulico
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.045, 0.038), carbonRawMat);
      caliper.position.set(-0.10, 0.08, 0.056);
      wheel.add(caliper);

      // Cassette 12 velocidades (10-52 dientes) si es trasera
      if (isRear) {
        const cassetteGroup = new THREE.Group();
        for (let c = 0; c < 9; c++) {
          const cR = 0.048 + c * 0.016;
          const cog = new THREE.Mesh(new THREE.CylinderGeometry(cR, cR, 0.005, 24), darkSteelMat);
          cog.rotation.x = Math.PI / 2;
          cog.position.z = -0.022 - c * 0.006;
          cassetteGroup.add(cog);
        }
        wheel.add(cassetteGroup);
      }

      return wheel;
    }

    const rearWheel = buildXCWheel(true);
    rearWheel.position.copy(REAR_AXLE);
    bike.add(rearWheel);

    const frontWheel = buildXCWheel(false);
    frontWheel.position.copy(FRONT_AXLE);
    bike.add(frontWheel);

    // 10. TRANSMISIÓN MONOPLATO 1X12 (PLATO 34T, BIELAS, PEDALES Y CAMBIO TRASERO)
    const chainring = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.007, 32), darkSteelMat);
    chainring.rotation.x = Math.PI / 2;
    chainring.position.set(BB.x, BB.y, -0.06);
    bike.add(chainring);

    // Bielas de carbono
    const crankL = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.21, 0.016), carbonRawMat);
    crankL.position.set(BB.x + 0.05, BB.y - 0.08, 0.08);
    crankL.rotation.z = 0.42;
    bike.add(crankL);

    const pedalL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.022, 0.09), carbonRawMat);
    pedalL.position.set(BB.x + 0.09, BB.y - 0.17, 0.12);
    bike.add(pedalL);

    const crankR = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.21, 0.016), carbonRawMat);
    crankR.position.set(BB.x - 0.05, BB.y + 0.08, -0.08);
    crankR.rotation.z = 0.42;
    bike.add(crankR);

    const pedalR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.022, 0.09), carbonRawMat);
    pedalR.position.set(BB.x - 0.09, BB.y + 0.17, -0.12);
    bike.add(pedalR);

    // Cambio trasero con embrague Shadow Plus
    const rdBody = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.11, 0.05), carbonRawMat);
    rdBody.position.set(REAR_AXLE.x + 0.07, REAR_AXLE.y - 0.11, -0.075);
    bike.add(rdBody);

    // Cadena de transmisión
    bike.add(createTube(
      new THREE.Vector3(BB.x, BB.y + 0.095, -0.06),
      new THREE.Vector3(REAR_AXLE.x, REAR_AXLE.y + 0.075, -0.05),
      0.007,
      darkSteelMat,
      8
    ));
    bike.add(createTube(
      new THREE.Vector3(BB.x, BB.y - 0.095, -0.06),
      new THREE.Vector3(REAR_AXLE.x + 0.07, REAR_AXLE.y - 0.13, -0.06),
      0.007,
      darkSteelMat,
      8
    ));

    bike.position.set(0, 0.05, 0);

    // --- INTERACCIÓN DE USUARIO & ROTACIÓN 360° ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0.38;
    let targetRotX = 0.05;
    let currentRotY = 0.38;
    let currentRotX = 0.05;
    let autoRotate = true;
    let rotationSpeed = 0.004;

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
      }, 5000);
    }

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('mousedown', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp, { passive: true });

    canvasElem.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    // Controles de preajuste de cámara
    const btnPerspective = document.getElementById('view-perspective');
    const btnSide = document.getElementById('view-side');
    const btnFront = document.getElementById('view-front');
    const btnRotateToggle = document.getElementById('toggle-rotate');

    function animateCameraTo(targetPos, targetLookAt) {
      const startPos = camera.position.clone();
      const startTime = performance.now();
      const duration = 900;

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
        targetRotY = 0.38;
        targetRotX = 0.05;
        animateCameraTo(new THREE.Vector3(2.9, 1.35, 3.1), new THREE.Vector3(0, 0.85, 0));
      });
    }

    if (btnSide) {
      btnSide.addEventListener('click', () => {
        targetRotY = 0;
        targetRotX = 0;
        animateCameraTo(new THREE.Vector3(0, 1.0, 4.1), new THREE.Vector3(0, 0.85, 0));
      });
    }

    if (btnFront) {
      btnFront.addEventListener('click', () => {
        targetRotY = Math.PI / 2;
        targetRotX = 0.08;
        animateCameraTo(new THREE.Vector3(3.7, 1.25, 0), new THREE.Vector3(0, 0.85, 0));
      });
    }

    if (btnRotateToggle) {
      btnRotateToggle.addEventListener('click', () => {
        autoRotate = !autoRotate;
        btnRotateToggle.classList.toggle('active', autoRotate);
      });
    }

    // --- PUNTOS INTERACTIVOS (CONSEJOS REALES PARA MUJER EN MTB) ---
    const hotspots = [
      { id: 'spot-saddle', pos: new THREE.Vector3(-0.64, 1.62, 0), label: 'Sillín & Culotte' },
      { id: 'spot-cockpit', pos: new THREE.Vector3(0.86, 1.48, 0.25), label: 'Guantes & Gafas' },
      { id: 'spot-bottle', pos: new THREE.Vector3(0.38, 0.94, 0), label: 'Hidratación & Snack' },
      { id: 'spot-pack', pos: new THREE.Vector3(-0.78, 1.48, 0), label: 'Bolsita de Sillín' },
      { id: 'spot-wheels', pos: new THREE.Vector3(1.36, 0.63, 0.08), label: 'Ruedas & Repuesto' },
      { id: 'spot-helmet', pos: new THREE.Vector3(0.86, 1.70, 0), label: 'Casco & Peinado' },
      { id: 'spot-shock', pos: new THREE.Vector3(0.08, 1.24, 0), label: 'Suspensión & Filosofía' }
    ];

    const hotspotContainer = document.getElementById('bike-hotspots');
    const adviceCard = document.getElementById('bike-advice-card');
    const adviceTag = document.getElementById('advice-tag');
    const adviceIcon = document.getElementById('advice-icon');
    const adviceTitle = document.getElementById('advice-title');
    const adviceQuote = document.getElementById('advice-quote');
    const adviceDesc = document.getElementById('advice-desc');
    const adviceTip = document.getElementById('advice-tip');

    function showAdvice(spotId) {
      const data = recommendationsData[spotId];
      if (!data) return;

      if (adviceTag) adviceTag.textContent = data.tag;
      if (adviceIcon) adviceIcon.className = data.icon;
      if (adviceTitle) adviceTitle.textContent = data.title;
      if (adviceQuote) adviceQuote.textContent = data.quote;
      if (adviceDesc) adviceDesc.textContent = data.desc;
      if (adviceTip) adviceTip.textContent = data.tip;

      // Update active pin
      document.querySelectorAll('.hotspot-pin').forEach(p => {
        p.classList.toggle('active', p.id === spotId);
      });

      // Update category pill buttons
      document.querySelectorAll('.advice-pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.spot === spotId);
      });

      if (adviceCard) {
        adviceCard.classList.add('highlight');
        setTimeout(() => adviceCard.classList.remove('highlight'), 600);
      }
    }

    if (hotspotContainer) {
      hotspotContainer.innerHTML = '';
      hotspots.forEach(spot => {
        const pin = document.createElement('button');
        pin.className = 'hotspot-pin';
        pin.id = spot.id;
        pin.setAttribute('aria-label', spot.label);
        pin.innerHTML = `
          <span class="pin-pulse"></span>
          <span class="pin-dot"></span>
          <span class="pin-label">${spot.label}</span>
        `;
        pin.addEventListener('click', (e) => {
          e.stopPropagation();
          showAdvice(spot.id);
        });
        hotspotContainer.appendChild(pin);
      });
    }

    // Connect external category pill buttons
    document.querySelectorAll('.advice-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const spotId = btn.dataset.spot;
        if (spotId) showAdvice(spotId);
      });
    });

    // Show initial recommendation (Sillín y Culotte)
    showAdvice('spot-saddle');

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

        pin.style.display = 'flex';
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
      const w = container.clientWidth || 850;
      const h = container.clientHeight || 520;
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

      rearWheel.rotation.z -= 0.006;
      frontWheel.rotation.z -= 0.006;

      bike.position.y = 0.05 + Math.sin(time * 0.002) * 0.012;

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
