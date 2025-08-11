import React, { useRef, useEffect } from "react";

export default function LeftPanel() {
  const swingRef = useRef(null);

  // 3D rotation state (radians)
  const angleX = useRef(0); // tilt forward/back
  const angleY = useRef(0); // tilt left/right

  // angular velocities (rad/s)
  const velX = useRef(0);
  const velY = useRef(0);

  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  const pivot = useRef({ x: 0, y: 0 }); // top-center pivot (screen coords)

  // physics tuning
  const OMEGA = 3.2; // natural frequency (rad/s)
  const ZETA = 0.08; // damping ratio
  const MAX_ANGLE_DEG = 30; // clamp rotation for realism

  // update pivot position (top center of swingRef)
  const updatePivot = () => {
    if (!swingRef.current) return;
    const r = swingRef.current.getBoundingClientRect();
    pivot.current.x = r.left + r.width / 2;
    pivot.current.y = r.top; // top of the swing container = fixed ceiling point
  };

  useEffect(() => {
    updatePivot();
    window.addEventListener("resize", updatePivot);
    window.addEventListener("scroll", updatePivot, { passive: true });
    return () => {
      window.removeEventListener("resize", updatePivot);
      window.removeEventListener("scroll", updatePivot);
    };
  }, []);

  // Map pointer position to target angles (radians).
  // We map horizontal pointer displacement to rotateY and vertical to rotateX,
  // scaled by a reference length (approx. distance from pivot to card center).
  const pointerToAngles = (clientX, clientY) => {
    if (!swingRef.current) return { tx: 0, ty: 0 };
    const r = swingRef.current.getBoundingClientRect();
    // distance from pivot to card center (px) — used as a sensible normalization
    const cardCenterY = r.top + r.height / 2;
    const lengthPx = Math.max(cardCenterY - pivot.current.y, 120);

    const dx = clientX - pivot.current.x;
    const dy = clientY - pivot.current.y;

    // horizontal -> yaw (rotateY), vertical -> pitch (rotateX)
    const tyDeg = (dx / lengthPx) * MAX_ANGLE_DEG;
    const txDeg = (-dy / lengthPx) * (MAX_ANGLE_DEG * 0.6); // less vertical tilt than horizontal

    // clamp
    const tyClamped = Math.max(-MAX_ANGLE_DEG, Math.min(MAX_ANGLE_DEG, tyDeg));
    const txClamped = Math.max(-MAX_ANGLE_DEG, Math.min(MAX_ANGLE_DEG, txDeg));

    // convert to radians
    return { tx: (txClamped * Math.PI) / 180, ty: (tyClamped * Math.PI) / 180 };
  };

  // Start dragging (called on pointerdown on strap or card)
  const startDrag = (clientX, clientY) => {
    updatePivot();
    dragging.current = true;
    lastPointer.current = { x: clientX, y: clientY };
    lastTime.current = performance.now();

    // compute immediate target and snap angles to pointer
    const { tx, ty } = pointerToAngles(clientX, clientY);
    // set angles directly while dragging
    angleX.current = tx;
    angleY.current = ty;
    velX.current = 0;
    velY.current = 0;
  };

  // Move while dragging
  const moveDrag = (clientX, clientY) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dt = Math.max((now - lastTime.current) / 1000, 1e-6);

    const { tx, ty } = pointerToAngles(clientX, clientY);

    // compute velocities from change in angle
    const vx = (tx - angleX.current) / dt;
    const vy = (ty - angleY.current) / dt;

    // set angles to target (stick to pointer)
    angleX.current = tx;
    angleY.current = ty;

    // store some of the drag velocity to carry into the physics when released
    velX.current = vx * 0.9;
    velY.current = vy * 0.9;

    lastPointer.current = { x: clientX, y: clientY };
    lastTime.current = now;
  };

  // End dragging
  const endDrag = () => {
    dragging.current = false;
    lastTime.current = 0;
  };

  // Pointer event handlers (attach on strap & card)
  useEffect(() => {
    let rafId = 0;
    const loop = (t) => {
      if (!lastTime.current) lastTime.current = t;
      const dt = Math.min((t - lastTime.current) / 1000, 0.04); // cap dt
      lastTime.current = t;

      if (!dragging.current) {
        // Spring / pendulum-like physics for each axis (linearized)
        // acc = -omega^2 * angle - 2*zeta*omega*vel
        const accX = -OMEGA * OMEGA * angleX.current - 2 * ZETA * OMEGA * velX.current;
        const accY = -OMEGA * OMEGA * angleY.current - 2 * ZETA * OMEGA * velY.current;

        velX.current += accX * dt;
        velY.current += accY * dt;

        angleX.current += velX.current * dt;
        angleY.current += velY.current * dt;

        // tiny clamp to avoid explosion
        const maxRad = (MAX_ANGLE_DEG * Math.PI) / 180;
        angleX.current = Math.max(-maxRad, Math.min(maxRad, angleX.current));
        angleY.current = Math.max(-maxRad, Math.min(maxRad, angleY.current));
      }

      // Apply 3D transform to swingRef
      if (swingRef.current) {
        const rx = (angleX.current * 180) / Math.PI; // degrees
        const ry = (angleY.current * 180) / Math.PI;
        const rz = (angleY.current * 180) / Math.PI * 0.07; // small twist

        swingRef.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // attach window pointermove/up when pointerdown occurs to ensure we capture outside element
  useEffect(() => {
    const onPointerMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      moveDrag(e.clientX, e.clientY);
    };
    const onPointerUp = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      endDrag();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    const onPointerDownGlobal = (e) => {
      // Only start global-level drag if down was on an allowed element (we already start drag in onPointerDown handlers)
      // This function is a noop, kept for completeness.
    };

    window.addEventListener("pointerdown", onPointerDownGlobal);
    return () => {
      window.removeEventListener("pointerdown", onPointerDownGlobal);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  // Handlers to attach to strap and card elements
  const handlePointerDown = (e) => {
    // Prevent text selection / touch scrolling
    e.preventDefault();
    // Start dragging and attach global move/up listeners
    startDrag(e.clientX, e.clientY);

    const onMove = (ev) => {
      ev.preventDefault();
      moveDrag(ev.clientX, ev.clientY);
    };
    const onUp = (ev) => {
      ev.preventDefault();
      endDrag();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
  };

return (
  <div
    className="min-h-screen bg-black flex flex-col justify-start items-center pt-6"
    style={{ perspective: 1200, userSelect: "none", touchAction: "none" }}
  >
    {/* Swing container: strap + card rotate together around top-center */}
    <div
      ref={swingRef}
      style={{
        transformOrigin: "center top",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Strap area */}
      <div className="flex flex-col items-center select-none">
        {/* Connector knob */}
        <div
          className="w-6 h-6 bg-gray-400 rounded-full shadow-md"
          style={{ transformStyle: "preserve-3d", translateZ: "4px" }}
        />
        {/* Visible strap (thicker, shorter) - pointer down attached */}
        <div
          onPointerDown={handlePointerDown}
          className="w-6 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500"
          style={{ height: 120, cursor: "grab" }}
        />
      </div>

      {/* Card */}
      <div
        onPointerDown={handlePointerDown}
        className="relative w-80 h-96 mt-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-600 shadow-2xl cursor-grab active:cursor-grabbing"
        style={{ transformStyle: "preserve-3d", userSelect: "none", touchAction: "none" }}
      >
        {/* Lifted header (3D parallax) */}
        <div
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-8 rounded-t-lg flex items-center justify-center"
          style={{ transform: "translateZ(26px)" }}
        >
          <div className="text-white font-bold text-xs tracking-wider">IDENTIFICATION</div>
        </div>

        <div className="p-4 text-white">
          {/* Photo lifted */}
          <div
            className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-500 shadow-inner"
            style={{ transform: "translateZ(32px)" }}
          >
            <img
              src="/prajjwal.png"
              alt="Profile"
              className="w-full h-full object-cover"
              style={{ display: "block", backfaceVisibility: "hidden" }}
            />
          </div>

          {/* Content slightly lifted */}
          <div className="space-y-3 text-center" style={{ transform: "translateZ(18px)" }}>
            <div className="border-b border-gray-600 pb-2">
              <div className="text-gray-300 text-sm font-semibold tracking-wide">
                PRAJJWAL RAWAT
              </div>
            </div>
            <div className="pb-2">
              <div className="text-gray-400 text-sm font-medium">WEB DEVELOPER</div>
            </div>
          </div>

          <div className="mt-4 flex justify-center" style={{ transform: "translateZ(12px)" }}>
            <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-sm opacity-60" />
          </div>
        </div>

        {/* subtle holographic overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(135deg, rgba(255,255,255,0.02), transparent)",
            borderRadius: "0.5rem",
            transform: "translateZ(6px)",
          }}
        />
      </div>
    </div>

    {/* Instruction text */}
    <div
      className="mt-4 text-gray-500 text-sm text-center select-none"
      style={{ transform: "translateZ(8px)" }}
    >
      [click on it to interact with 3D model]
    </div>
  </div>
);
}