import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedOrganicShape() {
    const meshRef = useRef<THREE.Mesh>(null);
    const elapsed = useRef(0);

    useFrame((_state, delta) => {
        elapsed.current += delta;
        if (meshRef.current) {
            meshRef.current.rotation.x = elapsed.current * 0.15;
            meshRef.current.rotation.y = elapsed.current * 0.25;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
            <Icosahedron ref={meshRef} args={[1, 128]}>
                <MeshDistortMaterial
                    color="#D4AF37"
                    emissive="#AA771C"
                    emissiveIntensity={0.2}
                    roughness={0.1}
                    metalness={0.9}
                    distort={0.4}
                    speed={3}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </Icosahedron>
        </Float>
    );
}

export function GoldenMoleculeCanvas() {
    return (
        <div className="w-full h-full relative z-10 cursor-pointer">
            <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} dpr={[1, 2]}>
                {/* Local lighting only — no CDN-dependent Environment preset */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.8} color="#ffffff" />
                <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#F3E5AB" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#F3E5AB" />
                <pointLight position={[5, -5, 10]} intensity={0.3} color="#ffffff" />

                <AnimatedOrganicShape />

                {/* Soft shadow directly underneath */}
                <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={5} blur={2.5} far={4} color="#AA771C" />
            </Canvas>
        </div>
    );
}
