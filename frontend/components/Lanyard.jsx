"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import profile from "@/data/profile";

extend({ MeshLineGeometry, MeshLineMaterial });

// Card proportions in world units, and the texture size that matches them.
const CARD_W = 1.6;
const CARD_H = 2.25;
const TEX_W = 640;
const TEX_H = 900;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFront(ctx, photo) {
  ctx.clearRect(0, 0, TEX_W, TEX_H);
  ctx.save();
  roundRect(ctx, 0, 0, TEX_W, TEX_H, 34);
  ctx.clip();

  const bg = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
  bg.addColorStop(0, "#1b2333");
  bg.addColorStop(1, "#0b0f19");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  // Header band
  const band = ctx.createLinearGradient(0, 0, TEX_W, 0);
  band.addColorStop(0, "#2563eb");
  band.addColorStop(1, "#9333ea");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, TEX_W, 150);

  // Punched slot for the clip
  ctx.fillStyle = "#05070c";
  roundRect(ctx, TEX_W / 2 - 62, 26, 124, 26, 13);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "700 30px ui-monospace, Menlo, Consolas, monospace";
  ctx.fillText("I D E N T I F I C A T I O N", TEX_W / 2, 112);

  // Photo
  const px = TEX_W / 2 - 130;
  const py = 200;
  const pw = 260;
  const ph = 320;
  ctx.save();
  roundRect(ctx, px, py, pw, ph, 18);
  ctx.clip();
  ctx.fillStyle = "#273043";
  ctx.fillRect(px, py, pw, ph);
  if (photo) {
    // cover-fit
    const scale = Math.max(pw / photo.width, ph / photo.height);
    const sw = pw / scale;
    const sh = ph / scale;
    ctx.drawImage(photo, (photo.width - sw) / 2, (photo.height - sh) / 2, sw, sh, px, py, pw, ph);
  }
  ctx.restore();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 4;
  roundRect(ctx, px, py, pw, ph, 18);
  ctx.stroke();

  // Name and title
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "700 44px ui-monospace, Menlo, Consolas, monospace";
  ctx.fillText(profile.name.toUpperCase(), TEX_W / 2, 600);
  ctx.fillStyle = "#475569";
  ctx.fillRect(90, 628, TEX_W - 180, 2);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 28px ui-monospace, Menlo, Consolas, monospace";
  ctx.fillText(profile.title.toUpperCase(), TEX_W / 2, 682);

  // Chip
  const chip = ctx.createLinearGradient(70, 0, 170, 0);
  chip.addColorStop(0, "#facc15");
  chip.addColorStop(1, "#f97316");
  ctx.fillStyle = chip;
  roundRect(ctx, 70, 760, 100, 72, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 2;
  for (const y of [784, 808]) {
    ctx.beginPath();
    ctx.moveTo(70, y);
    ctx.lineTo(170, y);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(120, 760);
  ctx.lineTo(120, 832);
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.fillStyle = "#64748b";
  ctx.font = "500 24px ui-monospace, Menlo, Consolas, monospace";
  ctx.fillText("SRM IST · B.TECH CSE", TEX_W - 70, 790);
  ctx.fillText("CLASS OF 2027", TEX_W - 70, 824);

  ctx.restore();
}

function drawBack(ctx) {
  ctx.clearRect(0, 0, TEX_W, TEX_H);
  ctx.save();
  roundRect(ctx, 0, 0, TEX_W, TEX_H, 34);
  ctx.clip();
  const bg = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
  bg.addColorStop(0, "#0b0f19");
  bg.addColorStop(1, "#1b2333");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  // Magnetic stripe
  ctx.fillStyle = "#05070c";
  ctx.fillRect(0, 110, TEX_W, 110);

  ctx.textAlign = "center";
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "800 190px ui-monospace, Menlo, Consolas, monospace";
  ctx.fillText("PR", TEX_W / 2, 500);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "500 30px ui-monospace, Menlo, Consolas, monospace";
  ctx.fillText(profile.site.replace("https://www.", ""), TEX_W / 2, 590);

  // Decorative barcode
  let x = 110;
  let seed = 7;
  ctx.fillStyle = "#e5e7eb";
  while (x < TEX_W - 110) {
    seed = (seed * 31 + 11) % 97;
    const w = 3 + (seed % 4) * 3;
    ctx.fillRect(x, 680, w, 90);
    x += w + 4 + (seed % 3) * 3;
  }

  ctx.fillStyle = "#64748b";
  ctx.font = "500 24px ui-monospace, Menlo, Consolas, monospace";
  ctx.fillText("IF FOUND, HIRE THE OWNER", TEX_W / 2, 830);
  ctx.restore();
}

function makeTexture(draw) {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  draw(canvas.getContext("2d"));
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function useCardTextures() {
  const front = useMemo(() => makeTexture((ctx) => drawFront(ctx, null)), []);
  const back = useMemo(() => makeTexture(drawBack), []);
  const strap = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = "#172554";
    ctx.fillRect(0, 0, 512, 6);
    ctx.fillRect(0, 58, 512, 6);
    ctx.fillStyle = "#dbeafe";
    ctx.font = "700 26px ui-monospace, Menlo, Consolas, monospace";
    ctx.textBaseline = "middle";
    ctx.fillText("PRAJJWAL RAWAT  ·  PRAJJWAL RAWAT  ·", 10, 33);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  // Redraw the front once the photo has loaded.
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      drawFront(front.image.getContext("2d"), img);
      front.needsUpdate = true;
    };
    img.src = "/prajjwal.png";
  }, [front]);

  useEffect(
    () => () => {
      front.dispose();
      back.dispose();
      strap.dispose();
    },
    [front, back, strap]
  );

  return { front, back, strap };
}

function Band({ maxSpeed = 50, minSpeed = 10, anchorX = 0 }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const { width, height } = useThree((state) => state.size);
  const { front, back, strap } = useCardTextures();

  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2,
  };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_H / 2 + 0.32, 0],
  ]);

  // While dragging, stop the page underneath from selecting text.
  useEffect(() => {
    if (!dragged) return;
    const previous = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    window.getSelection()?.removeAllRanges();
    return () => {
      document.body.style.userSelect = previous;
    };
  }, [dragged]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      // Project the pointer into the scene and carry the card with it.
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      // Smooth the middle joints so the strap doesn't jitter when pulled taut.
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const dist = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        // Clamp to 1: after a slow frame (e.g. a background tab) a larger factor would overshoot and diverge.
        ref.current.lerped.lerp(
          ref.current.translation(),
          Math.min(1, delta * (minSpeed + dist * (maxSpeed - minSpeed)))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      // Ease the card back to facing the camera.
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  return (
    <>
      <group position={[anchorX, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.02]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            {/* Card body */}
            <RoundedBox args={[CARD_W, CARD_H, 0.04]} radius={0.02} smoothness={4}>
              <meshPhysicalMaterial color="#0b0f19" roughness={0.6} metalness={0.1} clearcoat={0.3} envMapIntensity={0.5} />
            </RoundedBox>
            {/* Printed faces, laminated */}
            <mesh position={[0, 0, 0.0215]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshPhysicalMaterial
                map={front}
                transparent
                roughness={0.55}
                metalness={0}
                clearcoat={0.35}
                clearcoatRoughness={0.3}
                envMapIntensity={0.5}
              />
            </mesh>
            <mesh position={[0, 0, -0.0215]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshPhysicalMaterial
                map={back}
                transparent
                roughness={0.55}
                metalness={0}
                clearcoat={0.35}
                clearcoatRoughness={0.3}
                envMapIntensity={0.5}
              />
            </mesh>
            {/* Metal clip and ring */}
            <mesh position={[0, CARD_H / 2 + 0.03, 0]}>
              <boxGeometry args={[0.36, 0.2, 0.07]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.7} />
            </mesh>
            <mesh position={[0, CARD_H / 2 + 0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.1, 0.022, 12, 32]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      {/* The strap's shape changes every frame, so skip culling against its stale bounds. */}
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={strap}
          repeat={[-3, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

// Places the lanyard's anchor at a fraction of the visible width from the centre
// (0 = centre, 0.27 = right-hand side). Remounts the simulation when that moves.
function Rig({ offsetX, contentWidth }) {
  const viewportWidth = useThree((state) => state.viewport.width);
  const pixelWidth = useThree((state) => state.size.width);
  // offsetX is a fraction of the page's content column, which may be narrower than the canvas.
  const column = contentWidth ? Math.min(contentWidth, pixelWidth) : pixelWidth;
  const anchorX = Math.round(((column * offsetX) / pixelWidth) * viewportWidth * 4) / 4;
  return <Band key={anchorX} anchorX={anchorX} />;
}

/**
 * Physically simulated ID badge on a lanyard. Drag the card to swing it.
 * Renders on a transparent canvas, so it sits on whatever is behind it.
 *
 * With `eventSource` (a DOM element), the canvas itself ignores the pointer and
 * listens on that element instead, so it can be layered over text and buttons
 * without blocking them while the card stays draggable anywhere inside it.
 */
// Pointer position relative to the canvas itself, wherever it sits on the page.
// Needed in overlay mode, where events come from another element.
function computeFromCanvas(event, state) {
  const rect = state.gl.domElement.getBoundingClientRect();
  state.pointer.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
  state.raycaster.setFromCamera(state.pointer, state.camera);
}

export default function Lanyard({ className = "", cameraZ = 11, offsetX = 0, contentWidth, eventSource }) {
  const overlay = Boolean(eventSource);
  return (
    <div className={className} style={{ touchAction: overlay ? "auto" : "none", pointerEvents: overlay ? "none" : "auto" }}>
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 25 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        eventSource={eventSource || undefined}
        eventPrefix={overlay ? "client" : "offset"}
        style={overlay ? { pointerEvents: "none" } : undefined}
        onCreated={(state) => {
          if (overlay) state.setEvents({ compute: computeFromCanvas });
        }}
      >
        <ambientLight intensity={1.1} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Rig offsetX={offsetX} contentWidth={contentWidth} />
        </Physics>
        <Environment resolution={256}>
          <color attach="background" args={["#000000"]} />
          <Lightformer intensity={0.8} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={1} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={1} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={2.5} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
