import React, { useEffect, useRef } from 'react';

const StarSkyBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numStars = 500;
    const stars = [];

    for (let i = 0; i < numStars; i++) {
      const x = (Math.random() - 0.5) * canvas.width; // 初始位置基于中心点
      const y = (Math.random() - 0.5) * canvas.height; // 初始位置基于中心点
      const z = Math.random() * canvas.width; // 用z轴来实现星星的深度效果
      stars.push({ x, y, z });
    }

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0a2a');
      gradient.addColorStop(0.5, '#0d1a4b');
      gradient.addColorStop(1, '#10206a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.z -= 0.6;  // 调整星星的速度
        if (star.z <= 0) {
          star.z = canvas.width;
        }

        const k = 400.0 / star.z;
        const px = star.x * k + canvas.width / 2;
        const py = star.y * k + canvas.height / 2;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const size = (1 - star.z / canvas.width) * 2;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      }

      requestAnimationFrame(drawStars);
    };

    drawStars();
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
    }}></canvas>
  );
};

export default React.memo(StarSkyBackground);
