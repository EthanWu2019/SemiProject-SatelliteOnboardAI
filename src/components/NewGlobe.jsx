import React, { useEffect, useRef, useState, useMemo, useReducer } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import * as satellite from 'satellite.js';

const EARTH_RADIUS_KM = 6371; // km
const SATELLITE_SPEED_MULTIPLIER = 10; // 增加卫星速度的比例

const NewGlobe = ({ timeScale }) => {
  const globeEl = useRef();
  const cloudRef = useRef(new THREE.Group());
  const trackRef = useRef(new THREE.Group());
  const [globeRadius, setGlobeRadius] = useState();
  const [satData, setSatData] = useState([]);
  const [textures, setTextures] = useState([]);
  const [chinaGeoJson, setChinaGeoJson] = useState(null);
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const initialState = {
    time: new Date(),
    satelliteSpeed: 100 * SATELLITE_SPEED_MULTIPLIER * timeScale,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'TICK':
        return { ...state, time: new Date(+state.time + state.satelliteSpeed) };
      case 'SET_SATELLITE_SPEED':
        return { ...state, satelliteSpeed: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const textureUrls = [
    '/images/satellite1.jpg',
    '/images/satellite2.jpg',
    '/images/satellite3.jpg',
  ];

  const cloudTextureUrl = '/images/earth-clouds.png'; // Use the path to your downloaded cloud texture image here

  useEffect(() => {
    console.log('Component mounted');
    const loader = new THREE.TextureLoader();
    const loadedTextures = textureUrls.map(url => loader.load(url));
    setTextures(loadedTextures);
  
    loader.load(cloudTextureUrl, texture => {
      const cloudGeometry = new THREE.SphereGeometry(EARTH_RADIUS_KM + 1, 50, 50);
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
      });
      const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloudMesh.rotation.z = 23.4 * Math.PI / 180; // Tilt clouds to match Earth's axis tilt
      cloudRef.current.add(cloudMesh);
      console.log('Cloud texture loaded');
    });
  
    const satTles = [
      {
        name: '平台星PT01',
        tle1: '1 55254U 23007G   23242.04555716  .00015954  00000-0  55818-3 0  9993',
        tle2: '2 55254  97.3560 313.2238 0006579 166.6103 193.5314 15.29582380 34607',
      },
      {
        name: 'MF02A07星',
        tle1: '1 54751U 22167Q   23242.04717573  .00010365  00000-0  54362-3 0  9995',
        tle2: '2 54751  97.5690  19.3393 0014065  94.5336 265.7504 15.15863354 39534',
      }
    ];
  
    const satData = satTles.map(({ name, tle1, tle2 }) => ({
      satrec: satellite.twoline2satrec(tle1, tle2),
      name
    })).filter(d => !!satellite.propagate(d.satrec, new Date()).position);
  
    setSatData(satData);
  
    setGlobeRadius(globeEl.current.getGlobeRadius());
    globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2 });
  
    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = timeScale;
  
    const animate = time => {
      if (previousTimeRef.current != null) {
        const deltaTime = time - previousTimeRef.current;
        dispatch({ type: 'TICK', deltaTime });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
  
    fetch('/china.json')
      .then(res => res.json())
      .then(data => {
        setChinaGeoJson(data);
        console.log('China geoJSON loaded');
      });
  
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
  

  useEffect(() => {
    dispatch({ type: 'SET_SATELLITE_SPEED', payload: 100 * SATELLITE_SPEED_MULTIPLIER * timeScale });
  }, [timeScale]);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotateSpeed = timeScale;
    }
  }, [timeScale]);

  const objectsData = useMemo(() => {
    if (!satData.length) return [];
    const gmst = satellite.gstime(state.time);
    return satData.map(d => {
      const eci = satellite.propagate(d.satrec, state.time);
      if (eci.position) {
        const gdPos = satellite.eciToGeodetic(eci.position, gmst);
        const lat = satellite.radiansToDegrees(gdPos.latitude);
        const lng = satellite.radiansToDegrees(gdPos.longitude);
        // const alt = gdPos.height / EARTH_RADIUS_KM +0.1; // 使用原始高度
        const alt = 0.1; // 使用原始高度

        return { ...d, lat, lng, alt };
      }
      return d;
    });
  }, [satData, state.time]);

  const satObject = useMemo(() => {
    if (!globeRadius || textures.length === 0) return undefined;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: textures[Math.floor(Math.random() * textures.length)]
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(7, 7, 0.8);
    return sprite;
  }, [globeRadius, textures]);

  const satTracks = useMemo(() => {
    if (!satData.length) return [];
  
    const gmst = satellite.gstime(state.time);
    return satData.map((d, i) => {
      const positions = [];
      for (let j = -60; j <= 60; j += 1) {
        const time = new Date(state.time.getTime() + j * 60 * 1000);
        const eci = satellite.propagate(d.satrec, time);
        if (eci.position) {
          const gdPos = satellite.eciToGeodetic(eci.position, gmst);
          const lat = satellite.radiansToDegrees(gdPos.latitude);
          const lng = satellite.radiansToDegrees(gdPos.longitude);
          const alt = (gdPos.height / EARTH_RADIUS_KM) + 0.01;
          positions.push({ lat, lng, alt });
        }
      }
      const trackColor = i === 0 ? 'red' : 'blue';
  
      console.log(`Track for ${d.name}:`, positions); // 调试信息
      return {
        name: d.name,
        track: positions,
        color: trackColor
      };
    });
  }, [satData, state.time]);
  
  console.log('Paths Data:', satTracks.flatMap(d => d.track)); // 输出路径数据调试信息
  

  const renderStar = () => {
    console.log('Rendering star');
    const starShape = new THREE.Shape();
    const outerRadius = 0.2;
    const innerRadius = 0.1;
    const spikes = 5;
    const step = Math.PI / spikes;
  
    for (let i = 0; i < 2 * spikes; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(i * step) * radius;
      const y = Math.sin(i * step) * radius;
      if (i === 0) {
        starShape.moveTo(x, y);
      } else {
        starShape.lineTo(x, y);
      }
    }
    starShape.closePath();
    const starGeometry = new THREE.ShapeGeometry(starShape);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.position.set(116.405285, 39.904989, 0); // 设置五角星的位置在北京
    starMesh.rotation.set(Math.PI / 2, 0, 0); // 使五角星平行于地球表面
  
    console.log('Star created');
    return starMesh;
  };
  

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Globe
      ref={globeEl}
      width={2000}
      height={1000}
      backgroundColor="#000111"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      cloudsImageUrl="//unpkg.com/three-globe/example/img/earth-clouds.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      showGlobe={true}
      showAtmosphere={true}
      atmosphereColor="lightskyblue"
      pointsData={[]}
      waitForGlobeReady={true}
      animateIn={true}
      objectsData={objectsData}
      objectLabel="name"
      objectLat="lat"
      objectLng="lng"
      objectAltitude="alt"
      objectFacesSurface={false}
      objectThreeObject={satObject}
      polygonsData={chinaGeoJson ? chinaGeoJson.features : []}
      polygonCapColor={({ properties: d }) => d.fullname === '北京市' ? 'rgba(255, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0)'} // 北京填充红色
      polygonSideColor={({ properties: d }) => d.fullname === '北京市' ? 'rgba(255, 0, 0, 0.6)' : 'rgba(255, 0, 0, 0.1)'} // 边缘颜色
      polygonStrokeColor={({ properties: d }) => 'rgba(255, 0, 0, 1)'} // 描边颜色
      polygonStrokeWidth={1.5} // 设置描边宽度
      polygonLabel={({ properties: d }) => `
        <b>${d.fullname}</b>
        <br />
        Level: <i>${d.level}</i>
      `}
      polygonAltitude={({ properties: d }) => d.fullname === '北京市' ? 0.01 : 0.02} // 扩展边界
      onPolygonHover={setHoveredPolygon}
      onPolygonClick={({ properties: d }) => console.log(d.fullname)}
      pathsData={satTracks.flatMap(d => d.track)}
      pathPointLat={d => d.lat}
      pathPointLng={d => d.lng}
      pathPointAlt={d => d.alt}
      pathColor={d => d.color}
      pathDashLength={0}
      pathDashGap={0}
      pathDashAnimateTime={0}
    />
      <div id="time-log">{state.time.toString()}</div>
    </div>
  );
};

export default NewGlobe;