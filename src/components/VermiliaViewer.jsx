import React, { Suspense, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  CameraControls,
  ContactShadows,
  Html,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import {
  RotateCcw,
  Eye,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Compass,
  Cpu,
  Shield,
  Activity,
  Box,
  Grid,
  Sun,
  Crosshair,
  Clapperboard
} from 'lucide-react';

const MODEL_PATH = '/models/vermilia.vrm';

const BRAND_COLORS = {
  bg: '#040406',
  crimson: '#8f121d',
  crimsonGaze: '#ff1e38',
  gold: '#d4b07b',
};

const PARTS_CONFIG = [
  { id: 'Body', label: 'BODY (素体)', required: true, icon: Shield },
  { id: 'Costume', label: 'COSTUME (衣装・外套)', required: false, icon: Layers },
  { id: 'Horns', label: 'HORNS (真紅の角)', required: false, icon: Sparkles },
  { id: 'Mask', label: 'MASK (仮面)', required: false, icon: Eye },
  { id: 'Accessories', label: 'ACCESSORIES (装飾具)', required: false, icon: Activity },
];

const CAMERA_PRESETS = {
  FULL: {
    name: 'FULL BODY',
    position: [0, 0.95, 3.5],
    target: [0, 0.8, 0],
  },
  FACE: {
    name: 'FACE & HORNS',
    position: [0, 1.34, 1.2],
    target: [0, 1.3, 0],
  },
  COSTUME: {
    name: 'COSTUME & TEXTURE',
    position: [-0.65, 0.9, 1.6],
    target: [0, 0.8, 0],
  },
};

// ==========================================
// 🌟 ブラウザ内・動的テクスチャ軽量化関数
// ==========================================
function optimizeTextureInBrowser(texture, maxSize = 1024) {
  if (!texture || !texture.image) return;
  const img = texture.image;
  const w = img.width || (img.videoWidth || 0);
  const h = img.height || (img.videoHeight || 0);

  if (w > maxSize || h > maxSize) {
    try {
      const canvas = document.createElement('canvas');
      const scale = Math.min(maxSize / w, maxSize / h);
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      texture.image = canvas;
      texture.needsUpdate = true;
    } catch (e) {
      // CORS制限などの例外時はフォールバック
    }
  }
}

// 超軽量パーティクル
function AmbientParticles() {
  const count = 60;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cCrimson = new THREE.Color('#ff1e38');
    const cGold = new THREE.Color('#d4b07b');

    for (let i = 0; i < count; i++) {
      const radius = 0.5 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.random() * 2.2;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      const c = Math.random() > 0.4 ? cCrimson : cGold;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// リアルタイム計器 ＆ 実測FPSトラッカー
function TelemetryTracker({ controlsRef, telemetryRefs }) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(({ camera }) => {
    if (!telemetryRefs.current) return;
    const controls = controlsRef.current;
    const yawEl = telemetryRefs.current.yaw;
    const pitchEl = telemetryRefs.current.pitch;
    const distEl = telemetryRefs.current.dist;
    const fpsEl = telemetryRefs.current.fps;

    frameCount.current++;
    const now = performance.now();
    if (now - lastTime.current >= 400) {
      const currentFps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
      if (fpsEl) {
        fpsEl.textContent = `${currentFps} FPS`;
        fpsEl.className = `text-[9px] font-mono font-semibold ${
          currentFps >= 45 ? 'text-emerald-400' : currentFps >= 25 ? 'text-amber-400' : 'text-rose-500'
        }`;
      }
      frameCount.current = 0;
      lastTime.current = now;
    }

    let yaw = 0;
    let pitch = 0;
    let dist = 0;

    if (controls && controls.distance !== undefined) {
      yaw = controls.azimuthAngle * (180 / Math.PI);
      pitch = (Math.PI / 2 - controls.polarAngle) * (180 / Math.PI);
      dist = controls.distance;
    } else {
      dist = camera.position.length();
      yaw = Math.atan2(camera.position.x, camera.position.z) * (180 / Math.PI);
      pitch = Math.asin(camera.position.y / (dist || 1)) * (180 / Math.PI);
    }

    if (yawEl) yawEl.textContent = `${yaw >= 0 ? '+' : ''}${yaw.toFixed(1)}°`;
    if (pitchEl) pitchEl.textContent = `${pitch >= 0 ? '+' : ''}${pitch.toFixed(1)}°`;
    if (distEl) distEl.textContent = `${dist.toFixed(2)}m`;
  });

  return null;
}

// 足元サークル台座
function HologramPodium() {
  const outerRingRef = useRef();
  const innerRingRef = useRef();

  useFrame((_, delta) => {
    if (outerRingRef.current) outerRingRef.current.rotation.z += delta * 0.12;
    if (innerRingRef.current) innerRingRef.current.rotation.z -= delta * 0.2;
  });

  return (
    <group position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={outerRingRef}>
        <ringGeometry args={[1.35, 1.37, 64]} />
        <meshBasicMaterial color="#8f121d" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={innerRingRef}>
        <ringGeometry args={[1.1, 1.115, 48]} />
        <meshBasicMaterial color="#d4b07b" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.65, 0.66, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[2.8, 0.004]} />
        <meshBasicMaterial color="#8f121d" transparent opacity={0.18} />
      </mesh>
      <mesh position={[0, 0, -0.001]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[2.8, 0.004]} />
        <meshBasicMaterial color="#8f121d" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

// ローディングHUD
function LoadingHUD({ customProgress }) {
  const { progress } = useProgress();
  const displayProgress = customProgress !== undefined ? customProgress : progress;

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-[#040406]/90 border border-white/10 backdrop-blur-md min-w-[260px] text-center select-none shadow-2xl">
        <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.3em] text-[#d4b07b] uppercase mb-3">
          <Cpu className="w-3.5 h-3.5 animate-spin text-[#8f121d]" />
          <span>Synchronizing VRM Mesh</span>
        </div>
        <div className="w-full bg-white/5 h-[2px] overflow-hidden relative mb-2">
          <div
            className="h-full bg-gradient-to-r from-[#8f121d] via-[#d4b07b] to-[#8f121d] transition-all duration-200"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-[9px] font-mono text-zinc-400">
          <span>RUBEDO SYSTEM</span>
          <span>{Math.round(displayProgress)}%</span>
        </div>
      </div>
    </Html>
  );
}

// ==========================================
// VRMモデルローダー（美肌＆目元保護・超軽量版）
// ==========================================
function VermiliaVRMModel({ partsVisibility, shadingMode, onNodesDetected, setLoadProgress }) {
  const [vrm, setVrm] = useState(null);

  const partsMeshMapRef = useRef({
    Body: [],
    Costume: [],
    Horns: [],
    Mask: [],
    Accessories: [],
  });

  const blinkTimerRef = useRef({
    nextBlink: 2.5,
    elapsed: 0,
    isBlinking: false,
    blinkProgress: 0,
  });

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      MODEL_PATH,
      (gltf) => {
        const loadedVrm = gltf.userData.vrm;
        if (!loadedVrm) return;

        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);
        VRMUtils.rotateVRM0(loadedVrm);

        const box = new THREE.Box3().setFromObject(loadedVrm.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        if (size.y > 0.05) {
          const targetHeight = 1.55;
          const scale = targetHeight / size.y;
          loadedVrm.scene.scale.set(scale, scale, scale);

          box.setFromObject(loadedVrm.scene);
          loadedVrm.scene.position.x = -center.x * scale;
          loadedVrm.scene.position.z = -center.z * scale;
          loadedVrm.scene.position.y = -box.min.y;
        }

        const detected = new Set();
        const map = { Body: [], Costume: [], Horns: [], Mask: [], Accessories: [] };

        loadedVrm.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;

            const matName = (child.material?.name || '').toLowerCase();
            const meshName = (child.name || '').toLowerCase();

            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              if (!child.userData.origMaterial) {
                child.userData.origMaterial = mat;
              }

              // 🌟 テクスチャをブラウザ上で安全に1024pxへ動的縮小（VRAM爆速化）
              if (mat.map) optimizeTextureInBrowser(mat.map, 1024);

              const isEye = matName.includes('eye') || matName.includes('hitomi') || meshName.includes('eye');
              const isFaceSkin = (matName.includes('face') || matName.includes('kao') || matName.includes('head')) && !isEye;
              const isBodySkin = (matName.includes('body') || matName.includes('skin') || matName.includes('hada')) && !isEye;
              const isHorns = matName.includes('horn') || matName.includes('tsuno') || meshName.includes('horn');

              // A. 瞳・アイライン：一切変更せず本来の美しいテクスチャ色を100%保護！
              if (isEye) {
                if ('shadingShiftFactor' in mat) mat.shadingShiftFactor = 0.0;
              }
              // B. 顔の肌：セルフシャドウだけ除去（白飛びさせずテクスチャを生かす）
              else if (isFaceSkin) {
                if ('shadingShiftFactor' in mat) mat.shadingShiftFactor = -0.5;
                if ('shadingToonyFactor' in mat) mat.shadingToonyFactor = 0.95;
              }
              // C. 体の肌：ほんのり血色影
              else if (isBodySkin) {
                if ('shadingShiftFactor' in mat) mat.shadingShiftFactor = -0.2;
                if (mat.shadeColorFactor) mat.shadeColorFactor.set('#f3ded7');
              }
              // D. 角：深紅のルビートーン
              else if (isHorns) {
                if ('shadingShiftFactor' in mat) mat.shadingShiftFactor = 0.1;
                if (mat.shadeColorFactor) mat.shadeColorFactor.set('#660b14');
              }

              mat.needsUpdate = true;
            });

            PARTS_CONFIG.forEach((p) => {
              if (
                meshName.includes(p.id.toLowerCase()) ||
                (child.parent && child.parent.name.toLowerCase().includes(p.id.toLowerCase()))
              ) {
                map[p.id].push(child);
                detected.add(p.id);
              }
            });
          }
        });

        partsMeshMapRef.current = map;

        if (detected.size > 0 && onNodesDetected) {
          onNodesDetected(Array.from(detected));
        }

        setVrm(loadedVrm);
      },
      (progress) => {
        if (progress.total > 0) {
          setLoadProgress((progress.loaded / progress.total) * 100);
        }
      }
    );
  }, [onNodesDetected, setLoadProgress]);

  // パーツ可視性切替
  useEffect(() => {
    const map = partsMeshMapRef.current;
    PARTS_CONFIG.forEach((p) => {
      const isVisible = partsVisibility[p.id] ?? true;
      const meshes = map[p.id];
      if (meshes) {
        for (let i = 0; i < meshes.length; i++) {
          meshes[i].visible = isVisible;
        }
      }
    });
  }, [partsVisibility]);

  // シェーディングモード切替
  useEffect(() => {
    if (!vrm) return;

    vrm.scene.traverse((child) => {
      if (child.isMesh && child.userData.origMaterial) {
        if (shadingMode === 'WIREFRAME') {
          child.material.wireframe = true;
        } else {
          child.material.wireframe = false;
        }
      }
    });
  }, [shadingMode, vrm]);

  // 自動まばたき
  useFrame((_, delta) => {
    if (!vrm) return;

    const b = blinkTimerRef.current;
    b.elapsed += delta;

    if (!b.isBlinking && b.elapsed > b.nextBlink) {
      b.isBlinking = true;
      b.blinkProgress = 0;
      b.elapsed = 0;
      b.nextBlink = 2.0 + Math.random() * 3.5;
    }

    if (b.isBlinking) {
      b.blinkProgress += delta * 15.0;
      let blinkVal = 0;
      if (b.blinkProgress < 1.0) {
        blinkVal = b.blinkProgress;
      } else if (b.blinkProgress < 2.0) {
        blinkVal = 2.0 - b.blinkProgress;
      } else {
        b.isBlinking = false;
        blinkVal = 0;
      }

      if (vrm.expressionManager) {
        vrm.expressionManager.setValue('blink', blinkVal);
        vrm.expressionManager.update();
      } else if (vrm.blendShapeProxy) {
        vrm.blendShapeProxy.setValue('Blink', blinkVal);
        vrm.blendShapeProxy.update();
      }
    }
  });

  if (!vrm) return null;
  return <primitive object={vrm.scene} dispose={null} />;
}

// シネマティックカメラ制御ループ
function ShowcaseCameraController({ isShowcase, controlsRef }) {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!isShowcase || !controlsRef.current) return;

    timeRef.current += delta * 0.45;
    const t = timeRef.current;

    const radius = 2.3 + Math.sin(t * 0.5) * 0.8;
    const camX = Math.sin(t) * radius;
    const camZ = Math.cos(t) * radius;
    const camY = 0.9 + Math.sin(t * 0.8) * 0.4;
    const targetY = 0.85 + Math.sin(t * 0.8) * 0.35;

    controlsRef.current.setLookAt(camX, camY, camZ, 0, targetY, 0, false);
  });

  return null;
}

// 3Dシーン
function Scene({
  partsVisibility,
  shadingMode,
  isShowcase,
  onNodesDetected,
  controlsRef,
  telemetryRefs,
  setLoadProgress
}) {
  return (
    <>
      <CameraControls
        ref={controlsRef}
        dampingFactor={0.05}
        minDistance={0.5}
        maxDistance={5.0}
        maxPolarAngle={Math.PI / 2 + 0.02}
        minPolarAngle={0.2}
      />

      <ShowcaseCameraController isShowcase={isShowcase} controlsRef={controlsRef} />
      <TelemetryTracker controlsRef={controlsRef} telemetryRefs={telemetryRefs} />

      {/* 🌟 VRoid Hub完全準拠：王道2灯のみ（GPU負荷激減 ＆ 白飛び完全解消） */}
      <ambientLight intensity={0.9} color="#ffffff" />
      <directionalLight position={[0.8, 2.2, 2.5]} intensity={1.25} color="#ffffff" />

      <HologramPodium />
      <AmbientParticles />

      <Suspense fallback={<LoadingHUD />}>
        <VermiliaVRMModel
          partsVisibility={partsVisibility}
          shadingMode={shadingMode}
          onNodesDetected={onNodesDetected}
          setLoadProgress={setLoadProgress}
        />
      </Suspense>

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.4}
        scale={3.0}
        blur={2.0}
        far={1.2}
        color="#000000"
        frames={1}
      />
    </>
  );
}

// ==========================================
// メインコンポーネント VermiliaViewer
// ==========================================
export default function VermiliaViewer() {
  const controlsRef = useRef();
  const [loadProgress, setLoadProgress] = useState(0);
  const [isShowcase, setIsShowcase] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const telemetryRefs = useRef({
    yaw: null,
    pitch: null,
    dist: null,
    fps: null,
  });

  const [partsVisibility, setPartsVisibility] = useState({
    Body: true,
    Costume: true,
    Horns: true,
    Mask: true,
    Accessories: true,
  });

  const [shadingMode, setShadingMode] = useState('SOLID');
  const [detectedParts, setDetectedParts] = useState(PARTS_CONFIG.map((p) => p.id));
  const [activePreset, setActivePreset] = useState('FULL');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const applyCameraPreset = (presetKey) => {
    setIsShowcase(false);
    setActivePreset(presetKey);
    const preset = CAMERA_PRESETS[presetKey];
    if (controlsRef.current && preset) {
      controlsRef.current.setLookAt(
        preset.position[0],
        preset.position[1],
        preset.position[2],
        preset.target[0],
        preset.target[1],
        preset.target[2],
        true
      );
    }
  };

  useEffect(() => {
    if (controlsRef.current && !isShowcase) {
      controlsRef.current.autoRotate = isAutoRotate && isTabVisible;
      controlsRef.current.autoRotateSpeed = 0.8;
    }
  }, [isAutoRotate, isShowcase, isTabVisible]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyCameraPreset('FULL');
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const togglePart = useCallback((partId) => {
    setPartsVisibility((prev) => ({
      ...prev,
      [partId]: !prev[partId],
    }));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[660px] sm:h-[720px] lg:h-[760px] bg-[#030305] text-white select-none overflow-hidden font-sans border border-white/10 shadow-2xl"
    >
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0.95, 3.5], fov: 26 }}
        onPointerDown={() => {
          setIsShowcase(false);
          if (controlsRef.current) controlsRef.current.autoRotate = false;
        }}
        onPointerUp={() => {
          if (controlsRef.current) controlsRef.current.autoRotate = isAutoRotate;
        }}
      >
        {isTabVisible && (
          <Scene
            partsVisibility={partsVisibility}
            shadingMode={shadingMode}
            isShowcase={isShowcase}
            onNodesDetected={(nodes) => setDetectedParts(nodes)}
            controlsRef={controlsRef}
            telemetryRefs={telemetryRefs}
            setLoadProgress={setLoadProgress}
          />
        )}
      </Canvas>

      {/* シネマティック演出：上下黒帯 */}
      <div
        className={`absolute top-0 left-0 right-0 bg-black transition-all duration-700 pointer-events-none z-10 ${
          isShowcase ? 'h-9 border-b border-white/10' : 'h-0'
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-black transition-all duration-700 pointer-events-none z-10 ${
          isShowcase ? 'h-9 border-t border-white/10' : 'h-0'
        }`}
      />

      {/* 四隅のクロップマーク */}
      <div className="pointer-events-none absolute inset-4">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#d4b07b]/70" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#d4b07b]/70" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#d4b07b]/70" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#d4b07b]/70" />
      </div>

      {/* 左上：光学計器HUD ＆ リアルタイムFPS */}
      <div
        className={`absolute top-6 left-6 pointer-events-none bg-[#030305]/80 backdrop-blur-md p-3.5 border border-white/10 min-w-[210px] shadow-2xl transition-opacity duration-500 ${
          isShowcase ? 'opacity-30' : 'opacity-100'
        }`}
      >
        <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.25em] text-[#d4b07b] uppercase mb-2.5 border-b border-white/10 pb-1.5 gap-3">
          <div className="flex items-center space-x-1.5 shrink-0">
            <Crosshair className="w-3.5 h-3.5 text-[#8f121d]" />
            <span>OPTICAL TELEMETRY</span>
          </div>
          <span
            ref={(el) => (telemetryRefs.current.fps = el)}
            className="text-[9px] font-mono font-semibold text-emerald-400 shrink-0"
          >
            60 FPS
          </span>
        </div>

        <div className="space-y-1.5 text-[10px] font-mono">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 tracking-wider">CAM.YAW</span>
            <span ref={(el) => (telemetryRefs.current.yaw = el)} className="text-zinc-200 tabular-nums font-semibold">
              +0.0°
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 tracking-wider">CAM.PITCH</span>
            <span ref={(el) => (telemetryRefs.current.pitch = el)} className="text-zinc-200 tabular-nums font-semibold">
              +0.0°
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 tracking-wider">DISTANCE</span>
            <span ref={(el) => (telemetryRefs.current.dist = el)} className="text-[#d4b07b] tabular-nums font-semibold">
              3.50m
            </span>
          </div>
          <div className="flex justify-between items-center pt-1.5 border-t border-white/5">
            <span className="text-zinc-500 tracking-wider">SHADING</span>
            <span className="text-zinc-300 uppercase tracking-widest font-semibold">{shadingMode}</span>
          </div>
        </div>
      </div>

      {/* 右側インスペクター */}
      <div
        className={`absolute top-6 right-6 bottom-20 w-64 pointer-events-auto bg-[#030305]/85 backdrop-blur-md p-4 border border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto transition-opacity duration-500 ${
          isShowcase ? 'opacity-30 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.25em] text-[#d4b07b] uppercase mb-2 border-b border-white/10 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <Sun className="w-3.5 h-3.5 text-[#8f121d]" />
                <span>RENDER MODE</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'SOLID', label: 'SOLID', icon: Box },
                { id: 'WIREFRAME', label: 'WIRE', icon: Grid },
              ].map((mode) => {
                const isActive = shadingMode === mode.id;
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setShadingMode(mode.id)}
                    className={`py-1.5 px-2 text-[9px] font-mono flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#8f121d] bg-[#8f121d]/20 text-white shadow-[0_0_10px_rgba(143,18,29,0.35)]'
                        : 'border-white/10 bg-black/40 text-zinc-500 hover:border-white/20 hover:text-zinc-300'
                    }`}
                  >
                    <Icon className="w-3 h-3 text-[#d4b07b]" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.25em] text-[#d4b07b] uppercase mb-2 border-b border-white/10 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-[#8f121d]" />
                <span>MODULE TOGGLE</span>
              </div>
              <span className="text-[9px] text-zinc-500">PARTS</span>
            </div>

            <div className="space-y-1.5">
              {PARTS_CONFIG.filter((p) => detectedParts.includes(p.id)).map((part) => {
                const isVisible = partsVisibility[part.id] ?? true;
                const Icon = part.icon;

                return (
                  <button
                    key={part.id}
                    disabled={part.required}
                    onClick={() => togglePart(part.id)}
                    className={`w-full group flex items-center justify-between px-2.5 py-1.5 text-left text-xs font-mono tracking-wider transition-all duration-200 border cursor-pointer ${
                      part.required
                        ? 'border-white/5 bg-white/[0.02] text-zinc-500 cursor-not-allowed'
                        : isVisible
                        ? 'border-[#8f121d]/70 bg-[#8f121d]/20 text-zinc-100 hover:border-[#8f121d]'
                        : 'border-white/10 bg-black/40 text-zinc-500 hover:border-white/30 hover:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-3.5 h-3.5 transition-colors ${isVisible ? 'text-[#d4b07b]' : 'text-zinc-600'}`} />
                      <span className="text-[10px]">{part.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-[8px] font-mono uppercase tracking-widest ${
                          part.required ? 'text-zinc-600' : isVisible ? 'text-[#d4b07b]' : 'text-zinc-600'
                        }`}
                      >
                        {part.required ? 'LOCK' : isVisible ? 'EQUIP' : 'STRIP'}
                      </span>
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          part.required
                            ? 'bg-zinc-600'
                            : isVisible
                            ? 'bg-[#8f121d] shadow-[0_0_6px_#8f121d]'
                            : 'bg-zinc-800'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-zinc-500">
          <span>VRM PROTOCOL</span>
          <button
            onClick={() => setPartsVisibility({ Body: true, Costume: true, Horns: true, Mask: true, Accessories: true })}
            className="hover:text-white cursor-pointer transition-colors"
          >
            [ RESET PARTS ]
          </button>
        </div>
      </div>

      {/* 左下 操作ガイド */}
      <div className="absolute bottom-6 left-6 pointer-events-none hidden md:flex items-center space-x-3 text-[9px] font-mono tracking-widest text-zinc-400 bg-[#030305]/60 backdrop-blur-sm px-3 py-1.5 border border-white/5">
        <span>[ DRAG : ROTATE ]</span>
        <span className="text-zinc-600">/</span>
        <span>[ RIGHT DRAG : PAN ]</span>
        <span className="text-zinc-600">/</span>
        <span>[ SCROLL : ZOOM ]</span>
      </div>

      {/* 下部中央 視点プリセット */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center">
        <div className="bg-[#030305]/85 backdrop-blur-md border border-white/10 px-3 py-1.5 flex items-center space-x-1 shadow-2xl">
          <span className="text-[9px] font-mono tracking-[0.25em] text-[#d4b07b] uppercase px-2 hidden sm:inline-block">
            VIEWPOINT
          </span>

          <div className="h-3 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          {Object.entries(CAMERA_PRESETS).map(([key, preset]) => {
            const isActive = activePreset === key && !isShowcase;
            return (
              <button
                key={key}
                onClick={() => applyCameraPreset(key)}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'border-[#8f121d] bg-[#8f121d]/30 text-white font-semibold shadow-[0_0_12px_rgba(143,18,29,0.4)]'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-white/20'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 右下 補助操作 */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-center space-x-2">
        <button
          onClick={() => setIsShowcase(!isShowcase)}
          title="Cinematic Showcase Mode"
          className={`px-2.5 py-1.5 bg-[#030305]/80 backdrop-blur-md border flex items-center space-x-1.5 text-[10px] font-mono tracking-widest cursor-pointer transition-all ${
            isShowcase
              ? 'border-[#ff1e38] bg-[#8f121d]/40 text-white shadow-[0_0_12px_rgba(255,30,56,0.5)]'
              : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-zinc-100'
          }`}
        >
          <Clapperboard className="w-3.5 h-3.5 text-[#ff1e38]" />
          <span>SHOWCASE</span>
        </button>

        <button
          onClick={() => {
            setIsShowcase(false);
            setIsAutoRotate(!isAutoRotate);
          }}
          title="Toggle Turntable"
          className={`p-2 bg-[#030305]/80 backdrop-blur-md border transition-colors cursor-pointer ${
            isAutoRotate && !isShowcase
              ? 'border-[#d4b07b] text-[#d4b07b]'
              : 'border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300'
          }`}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotate && !isShowcase ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>

        <button
          onClick={() => applyCameraPreset('FULL')}
          title="Reset Camera"
          className="p-2 bg-[#030305]/80 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/30 transition-colors cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleFullscreen}
          title="Fullscreen"
          className="p-2 bg-[#030305]/80 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/30 transition-colors cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}