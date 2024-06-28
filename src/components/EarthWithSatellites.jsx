import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';

const EarthWithSatellites = () => {
    const myGlobe = new ThreeGlobe()
  .globeImageUrl(myImageUrl)
  .pointsData(myData);

    const myScene = new THREE.Scene();
    myScene.add(myGlobe);
  return (
    <Canvas style={{ width: '50vw', height: '50vh' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial
          attach="material"
          map={new THREE.TextureLoader().load('/mnt/data/earth_texture.jpg')}
        />
      </Sphere>
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

export default EarthWithSatellites;
