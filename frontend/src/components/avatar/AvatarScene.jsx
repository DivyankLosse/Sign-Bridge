import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import AvatarController from './AvatarController';

// A simple procedural robot/abstract character
const ProceduralCharacter = ({ currentSign }) => {
    const group = useRef();
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Give it a subtle breathing animation
        if (group.current) {
            group.current.position.y = Math.sin(t * 2) * 0.05;
        }
    });

    return (
        <group ref={group}>
            {/* Body */}
            <mesh position={[0, 1.2, 0]} castShadow>
                <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
                <meshStandardMaterial color="#8B5CF6" roughness={0.2} metalness={0.8} />
            </mesh>
            
            {/* Head */}
            <mesh position={[0, 2.2, 0]} castShadow>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="#A78BFA" roughness={0.1} metalness={0.9} />
            </mesh>
            
            {/* Visor */}
            <mesh position={[0, 2.2, 0.2]} castShadow>
                <boxGeometry args={[0.3, 0.1, 0.1]} />
                <meshStandardMaterial color="#000000" emissive="#10B981" emissiveIntensity={2} />
            </mesh>
            
            {/* Arms - controlled by AvatarController */}
            <AvatarController currentSign={currentSign} />
        </group>
    );
};

const AvatarScene = ({ currentSign }) => {
    return (
        <div className="w-full h-full min-h-[300px] bg-black/40 rounded-2xl overflow-hidden border border-white/10 relative">
            <Canvas shadows camera={{ position: [0, 2, 4], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-5, 5, -5]} intensity={0.5} color="#8B5CF6" />
                
                <ProceduralCharacter currentSign={currentSign} />
                
                <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={5} blur={2} far={4} />
                <Environment preset="city" />
                <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
            </Canvas>
            
            <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
                <div className="inline-block bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <p className="text-white font-medium text-sm">
                        {currentSign ? `Signing: ${currentSign}` : "Waiting for input..."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AvatarScene;
