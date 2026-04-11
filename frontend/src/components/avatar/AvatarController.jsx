import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AvatarController = ({ currentSign }) => {
    const leftArm = useRef();
    const rightArm = useRef();
    const targetLeftRot = useRef(new THREE.Vector3(0, 0, 0));
    const targetRightRot = useRef(new THREE.Vector3(0, 0, 0));
    
    // Determine target rotations based on sign 
    // Since we don't have real mocap, we use procedural interpolation for demo
    useEffect(() => {
        if (!currentSign) {
            // Idle position
            targetLeftRot.current.set(0, 0, 0.2);
            targetRightRot.current.set(0, 0, -0.2);
            return;
        }

        // Just hash the string to generate a pseudo-random but consistent pose
        let hash = 0;
        for (let i = 0; i < currentSign.length; i++) {
            hash = currentSign.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Use hash to generate some angles between -PI/2 and PI/2
        const r1 = ((hash % 100) / 100) * Math.PI - Math.PI/2;
        const r2 = (((hash >> 2) % 100) / 100) * Math.PI - Math.PI/2;
        const r3 = (((hash >> 4) % 100) / 100) * Math.PI - Math.PI/2;
        const r4 = (((hash >> 6) % 100) / 100) * Math.PI - Math.PI/2;

        // Frontal working space for sign language
        targetLeftRot.current.set(Math.abs(r1), r2 * 0.5, 0.5 + Math.abs(r3) * 0.5);
        targetRightRot.current.set(Math.abs(r4), r1 * 0.5, -0.5 - Math.abs(r2) * 0.5);
        
        // Reset to idle after 2 seconds
        const timer = setTimeout(() => {
            targetLeftRot.current.set(0, 0, 0.2);
            targetRightRot.current.set(0, 0, -0.2);
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [currentSign]);

    useFrame((state, delta) => {
        // Linearly interpolate current rotation to target rotation
        const lerpSpeed = 5 * delta;
        
        if (leftArm.current) {
            leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, targetLeftRot.current.x, lerpSpeed);
            leftArm.current.rotation.y = THREE.MathUtils.lerp(leftArm.current.rotation.y, targetLeftRot.current.y, lerpSpeed);
            leftArm.current.rotation.z = THREE.MathUtils.lerp(leftArm.current.rotation.z, targetLeftRot.current.z, lerpSpeed);
        }
        
        if (rightArm.current) {
            rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, targetRightRot.current.x, lerpSpeed);
            rightArm.current.rotation.y = THREE.MathUtils.lerp(rightArm.current.rotation.y, targetRightRot.current.y, lerpSpeed);
            rightArm.current.rotation.z = THREE.MathUtils.lerp(rightArm.current.rotation.z, targetRightRot.current.z, lerpSpeed);
        }
    });

    return (
        <group>
            {/* Left Arm Handle */}
            <group position={[-0.4, 1.5, 0]} ref={leftArm}>
                <mesh position={[0, -0.35, 0]} castShadow>
                    <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
                    <meshStandardMaterial color="#8B5CF6" />
                </mesh>
                {/* Hand */}
                <mesh position={[0, -0.7, 0]} castShadow>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#A78BFA" />
                </mesh>
            </group>
            
            {/* Right Arm Handle */}
            <group position={[0.4, 1.5, 0]} ref={rightArm}>
                <mesh position={[0, -0.35, 0]} castShadow>
                    <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
                    <meshStandardMaterial color="#8B5CF6" />
                </mesh>
                {/* Hand */}
                <mesh position={[0, -0.7, 0]} castShadow>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#A78BFA" />
                </mesh>
            </group>
        </group>
    );
};

export default AvatarController;
