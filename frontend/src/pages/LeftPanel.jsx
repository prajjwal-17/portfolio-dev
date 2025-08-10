import React, { useState, useRef, useEffect } from 'react';

export default function LeftPanel() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const animationRef = useRef(null);
  const pendulumAngle = useRef(0);
  const pendulumVelocity = useRef(0);
  const shakeOffset = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  // Physics simulation with improved parameters
  useEffect(() => {
    if (!isHovered) return;

    const animate = (currentTime) => {
      if (lastTime.current === 0) lastTime.current = currentTime;
      const deltaTime = (currentTime - lastTime.current) / 1000;
      lastTime.current = currentTime;

      // Enhanced pendulum physics
      const gravity = 12; // Increased gravity for more realistic swing
      const length = 1.5; // Longer pendulum length for slower, more natural motion
      const damping = 0.995; // Less damping for longer swinging
      const airResistance = 0.998; // Air resistance for more realism
      
      // Calculate pendulum motion with improved physics
      const acceleration = -(gravity / length) * Math.sin(pendulumAngle.current);
      pendulumVelocity.current += acceleration * deltaTime;
      pendulumVelocity.current *= damping * airResistance;
      pendulumAngle.current += pendulumVelocity.current * deltaTime;

      // Enhanced shake/vibration with physics-based movement
      const swingIntensity = Math.abs(pendulumVelocity.current) * 0.5;
      const shakeIntensity = 1.5 + swingIntensity;
      shakeOffset.current.x = (Math.random() - 0.5) * shakeIntensity;
      shakeOffset.current.y = (Math.random() - 0.5) * shakeIntensity * 0.3;

      // Apply transforms with improved motion
      if (cardRef.current) {
        const pendulumX = Math.sin(pendulumAngle.current) * 25; // Increased swing range
        const rotateY = (mousePosition.x - 0.5) * 15; // Enhanced mouse influence
        const rotateX = (mousePosition.y - 0.5) * -8;
        const rotateZ = pendulumAngle.current * 3; // More realistic rotation
        
        cardRef.current.style.transform = `
          perspective(1200px)
          rotateY(${rotateY + pendulumX}deg)
          rotateX(${rotateX}deg)
          translateX(${shakeOffset.current.x}px)
          translateY(${shakeOffset.current.y}px)
          rotateZ(${rotateZ}deg)
        `;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, mousePosition]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    lastTime.current = 0;
    // Give stronger initial impulse for more dramatic swing
    pendulumVelocity.current = (Math.random() - 0.5) * 5;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  return (
    <div className="border border-green-600 rounded-lg p-4 min-h-full bg-black relative overflow-hidden">
      {/* Pure black background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Long strap from top of page */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 z-0 shadow-sm" style={{height: 'calc(50vh - 50px)'}}></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-4 h-4 bg-gray-400 rounded-full z-0 shadow-md"></div>
      
      {/* Main content container */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
        <div className="relative">
          
          {/* ID Card */}
          <div
            ref={cardRef}
            className="relative w-80 h-96 cursor-pointer transition-transform duration-200 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center top'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            {/* Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-600 shadow-2xl">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-8 rounded-t-lg flex items-center justify-center">
                <div className="text-white font-bold text-xs tracking-wider">IDENTIFICATION</div>
              </div>
              
              {/* Card Content */}
              <div className="p-4 text-white">
                {/* Photo Area - larger and merged with card */}
                <div className="w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-gray-500 shadow-inner">
                  <img 
                    src="/prajjwal.png" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    style={{
                      imageRendering: 'crisp-edges',
                      filter: 'contrast(1.1) brightness(0.95) saturate(0.9)'
                    }}
                  />
                </div>
                
                {/* ID Information - Simplified */}
                <div className="space-y-3 text-center">
                  <div className="border-b border-gray-600 pb-2">
                    <div className="text-gray-300 text-sm font-semibold tracking-wide">PRAJJWAL</div>
                  </div>
                  
                  <div className="pb-2">
                    <div className="text-gray-400 text-sm font-medium">WEB DEVELOPER</div>
                  </div>
                </div>
                
                {/* Security Features */}
                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-sm opacity-60"></div>
                </div>
              </div>
              
              {/* Holographic overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/10 to-purple-500/10 rounded-lg pointer-events-none"></div>
              
              {/* Shine effect on hover */}
              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg pointer-events-none animate-pulse"></div>
              )}
            </div>
            
            {/* Card back shadow */}
            <div className="absolute inset-0 bg-black/50 rounded-lg transform translate-z-[-1px] blur-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Interactive 3D Card label */}
      <div className="absolute bottom-4 right-4 text-green-400 text-xs font-mono opacity-70">
        [Interactive 3D Card]
      </div>
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 text-gray-400 text-xs max-w-48">
        Hover over the ID card to activate realistic pendulum physics
      </div>
    </div>
  );
}