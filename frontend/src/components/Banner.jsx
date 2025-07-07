import React, { useRef, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import "../styles/Banner.css";
import NavBar from './NavBar';

const DOT_ROWS = 32;
const DOT_COLS = 61;
const DOT_SIZE = 8;
const DOT_SPACING = 24;

function Banner({ Title, Description }) {
  const bannerRef = useRef(null);
  // Remove mouse and canvasMouse state
  // Remove handleMouseMove, handleMouseLeave, handle3DMouseMove
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });
  const [canvasMouse, setCanvasMouse] = useState([0, 0]);

  const handleMouseMove = (e) => {
    const rect = bannerRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMouse({ x: -1000, y: -1000 });
  };

  // For 3D object mouse tracking
  const handle3DMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setCanvasMouse([x, y]);
  };

  const dots = [];
  for (let row = 0; row < DOT_ROWS; row++) {
    for (let col = 0; col < DOT_COLS; col++) {
      const x = col * DOT_SPACING + DOT_SPACING / 2;
      const y = row * DOT_SPACING + DOT_SPACING / 2;
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 80;
      const isNear = dist < maxDist;
      const scale = isNear ? 1.8 - dist / maxDist : 1;
      const color = isNear ? '#FF5207' : '#222';
      const offsetX = isNear ? dx * 0.08 : 0;
      const offsetY = isNear ? dy * 0.08 : 0;
      dots.push(
        <div
          key={`dot-${row}-${col}`}
          className="banner-dot"
          style={{
            left: x + offsetX,
            top: y + offsetY,
            width: DOT_SIZE * scale,
            height: DOT_SIZE * scale,
            background: color,
            boxShadow: isNear ? '0 0 8px #FF5207' : 'none',
            transition: 'all 0.15s cubic-bezier(.4,2,.6,1)',
          }}
        />
      );
    }
  }

  return (
    <div
      className="banner"
      ref={bannerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="banner-content">
        <div className="banner-left">
          <h1 className="banner-title">{Title}</h1>
          <p className="banner-description"><span>{Description}</span></p>
          <Link to="/marketplace" className="button-link">LJ8080</Link>
        </div>
        <div className="banner-right">
          <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} />
            <Suspense fallback={null}>
              <Model />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
      </div>
      <div className="banner-dots">{dots}</div>
    </div>
  );
}

function Model() {
  const mesh = useRef();
  const obj = useLoader(OBJLoader, '/model.obj');

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01; // Spin continuously
      mesh.current.rotation.x += 0.005;
    }
  });

  return (
    <primitive ref={mesh} object={obj} scale={0.05} />
  );
}

export default Banner;