import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import originalImage from '../assets/original.jpg';
import detectionImage from '../assets/detection.jpg';
import axios from 'axios'; // 用于前端与后端通信

function TargetDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageInfo, setImageInfo] = useState({
    name: 'original.jpg',
    size: '1.2 MB',
    resolution: '1920x1080',
  });
  const [algorithm, setAlgorithm] = useState('1');
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    // 获取文件信息
    const name = file.name;
    const size = (file.size / 1024 / 1024).toFixed(2) + ' MB';

    // 获取图片分辨率
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const resolution = `${img.width}x${img.height}`;
        setImageInfo({ name, size, resolution });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const handleRunClick = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('algorithm', algorithm);
  
    try {
      console.log(formData.get('image'));
      console.log(formData.get('algorithm'));

      const response = await axios.post('http://127.0.0.1:5002/api/process_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const outputImageUrl = URL.createObjectURL(blob);
        setOutputImage(outputImageUrl);
      } else {
        alert('完全失败');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('各种报错');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ marginLeft: '220px', padding: '20px', position: 'relative' }}>
      <BackButton />
      <div style={{ marginTop: '60px' }}>
        <h2>目标检测演示</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 第一部分：原图区 */}
          <div style={{ flex: 1, padding: '10px' }}>
            <h3 style={styles.title}>原图区</h3>
            <div style={styles.imageContainer}>
              {selectedImage ? (
                <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={styles.image} />
              ) : (
                <img src={originalImage} alt="Original" style={styles.image} />
              )}
            </div>
            <p style={styles.subtitle}>已选择图像信息</p>
            <table border="1" style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>图像名称</th>
                  <th>图像大小</th>
                  <th>图像分辨率</th>
                  <th>图像中心坐标</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.imageNameCell}>
                    <div style={styles.imageNameContent}>{imageInfo.name}</div>
                  </td>
                  <td>{imageInfo.size}</td>
                  <td>{imageInfo.resolution}</td>
                  <td>31.2304°N, 121.4737°E</td>
                </tr>
              </tbody>
            </table>
            <div>
              <label>输入经纬度：</label>
              <input type="text" placeholder="经纬度" />
            </div>
            <div>
              <label>选择图像：</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div>
              <label>选择算法：</label>
              <select value={algorithm} onChange={handleAlgorithmChange}>
                <option value="1">算法1</option>
                <option value="2">算法2</option>
              </select>
            </div>
          </div>
          {/* 第二部分：识别选取区 */}
          <div style={{ flex: 1, padding: '10px' }}>
            <h3 style={styles.title}>识别选取区</h3>
            <div style={styles.imageContainer}>
              {loading ? (
                <p>正在处理...</p>
              ) : outputImage ? (
                <img src={outputImage} alt="Detection" style={styles.image} />
              ) : (
                <div style={styles.emptyImageContainer}></div>
              )}
            </div>
            <h3 style={styles.subtitle}>程序运行信息</h3>
            <table border="1" style={styles.table}>
              <thead>
                <tr>
                  <th>应用名称</th>
                  <th>使用算法</th>
                  <th>占位符1</th>
                  <th>占位符2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>exampleApp</td>
                  <td>YOLOv5</td>
                  <td>占位符1</td>
                  <td>占位符2</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 第三部分：目标统计信息 */}
          <div style={{ flex: 1, padding: '10px' }}>
            <h3 style={styles.title}>目标统计信息</h3>
            <table border="1" style={styles.table}>
              <thead>
                <tr>
                  <th>类别</th>
                  <th>看不清</th>
                  <th>看不清2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>飞机</td>
                  <td>10</td>
                  <td>20</td>
                </tr>
                <tr>
                  <td>占位符</td>
                  <td>30</td>
                  <td>40</td>
                </tr>
              </tbody>
            </table>
            <h3 style={styles.subtitle}>目标详细信息</h3>
            <div style={styles.scrollContainer}>
              <table border="1" style={styles.table}>
                <thead>
                  <tr>
                    <th>编号</th>
                    <th>类别</th>
                    <th>位置信息</th>
                    <th>经纬度信息</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 20 }, (_, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>plane</td>
                      <td>[0,0,0,0]</td>
                      <td>[31.2304°N, 121.4737°E]</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 底部按钮 */}
            <div style={styles.buttonContainer}>
              <button style={styles.button} onClick={handleRunClick}>开始运行</button>
              <button style={styles.button}>统计结果</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: {
    fontSize: '18px',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    marginBottom: '10px'
  },
  imageContainer: {
    width: '100%',
    height: '300px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc'
  },
  emptyImageContainer: {
    width: '100%',
    height: '300px',
    border: '1px solid #ccc'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  table: {
    width: '100%',
    marginBottom: '10px'
  },
  tableHeader: {
    whiteSpace: 'nowrap'
  },
  imageNameCell: {
    maxWidth: '150px',
    overflow: 'hidden',
    position: 'relative'
  },
  imageNameContent: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    maxWidth: '100%',
  },
  imageNameWrapper: {
    overflowX: 'auto',
    maxWidth: '100%',
    paddingBottom: '10px'
  },
  scrollContainer: {
    overflowY: 'scroll',
    height: '200px',
    border: '1px solid black',
    padding: '10px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  },
  button: {
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
  }
};

export default TargetDetection;
