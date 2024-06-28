import React, { useEffect } from 'react';

function UnityComponent () {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "unity/Build/UnityLoader.js"; // 这里的路径根据实际情况修改
    script.onload = () => {
      window.createUnityInstance(document.querySelector("#unity-canvas"), {
        dataUrl: "/unity/Build/Build.data",    // 这里的路径根据实际情况修改
        frameworkUrl: "/unity/Build/Build.framework.js",
        codeUrl: "/unity/Build/Build.wasm",
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <canvas id="unity-canvas" style={{ width: '100%', height: '100%' }}></canvas>
    </div>
  );
};

export default UnityComponent;
