import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import originalImage from '../assets/original.jpg';
import axios from 'axios';
import * as XLSX from 'xlsx';
import * as UTIF from 'utif';

function ImageCompression() {
  const [imageInfo, setImageInfo] = useState({
    name: 'original.jpg',
    size: '1.2 MB',
    resolution: '1920x1080',
  });
  const [selectedImage, setSelectedImage] = useState(null); //这里是用来展示的图片
  const [selectedImagePath, setSeletedImagePath] = useState(null)//这里是展示图片的路径
  const [algorithm, setAlgorithm] = useState('1');
  const [mode] = useState('3');
  const [device, setDevice] = useState('1');
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOriginalImageZoomed, setIsOriginalImageZoomed] = useState(false);
  const [isOutputImageZoomed, setIsOutputImageZoomed] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('占位符');
  const [tableData, setTableData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [outputImageResolution, setOutputImageResolution] = useState(null)
  const [log, setLog] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const name = file.name;
    const size = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    setSeletedImagePath(file)
    setSelectedImage(file);

    const reader = new FileReader();

    reader.onload = async (event) => {
      if (file.type === 'image/tiff' || file.type === 'image/x-tiff') {
        console.log('TIFF file detected');
        try {
          // Upload the TIFF file to the backend for conversion
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post('http://localhost:5002/api/convert', formData, {
            responseType: 'blob',
          });

          // Create a URL for the returned JPEG image
          const imageUrl = URL.createObjectURL(response.data);
          const img = new Image();
          img.onload = () => {
            setSelectedImage(imageUrl);
          };
          img.src = imageUrl;

          // Set image info for display
          const tiff = UTIF.decode(event.target.result);
          UTIF.decodeImage(event.target.result, tiff);
          const firstImage = tiff[0];
          const width = firstImage.width || firstImage.t256;
          const height = firstImage.height || firstImage.t257;
          const resolution = `${width}x${height}`;
          setImageInfo({ name, size, resolution });
        } catch (error) {
          console.error('Error converting TIFF file:', error);
        }
      } else {
        console.log('Non-TIFF file detected');
        const img = new Image();
        img.onload = () => {
          const resolution = `${img.width}x${img.height}`;
          setImageInfo({ name, size, resolution });
          setSelectedImage(img.src);
        };
        img.src = event.target.result;
      }
    };

    if (file.type === 'image/tiff' || file.type === 'image/x-tiff') {
      reader.readAsArrayBuffer(file); // TIFF needs ArrayBuffer processing
    } else {
      reader.readAsDataURL(file); // Other formats read as DataURL
    }
  };



  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const handleDeviceChange = (e) => {
    setDevice(e.target.value);
  };

  const handleRunClick = async () => {
    setLoading(true);
    setDeviceData([]);
    setLogData([]);
    setTableData([]);
    setElapsedTime('正在玩命跑');
    setOutputImageResolution('正在等隔壁玩命')

    const formData = new FormData();

    formData.append('image', selectedImagePath);
    formData.append('mode', mode);
    formData.append('device', device);
    formData.append('algorithm', algorithm);

    try {
      const response = await axios.post('http://127.0.0.1:5002/api/process_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob'
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const outputImageUrl = URL.createObjectURL(blob);
        setOutputImage(outputImageUrl);
      } else {
        alert('完全失败');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('各种报错', error.message);
    } finally {
      setLoading(false);
    }

    try {
      const response = await fetch('src/assets/result/result_ai_info.xlsx');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const elapsedTimeCell = worksheet[`D2`];
      const elapsedTime = elapsedTimeCell ? elapsedTimeCell.v : 'N/A';
      setElapsedTime(elapsedTime);

      const resolutionCell = worksheet[`D6`];
      const outputResolution = resolutionCell ? resolutionCell.v : 'N/A';
      setOutputImageResolution(outputResolution);

      const tableData = [];
      let i = 3;
      while (worksheet[`A${i}`]) {
        const cellValue = worksheet[`A${i}`].v;
        const [type, conf, x_tl, y_tl, x_br, y_br, lon, lat, timeyear, timedate] = cellValue.split(/\s+/);
        tableData.push({
          index: i - 2,
          type,
          conf,
          location: `(${x_tl}, ${y_tl}), (${x_br}, ${y_br})`,
          latlong: `(${lon}, ${lat})`,
          time: `(${timeyear}, ${timedate})`,
        });
        i++;
      }
      setTableData(tableData);

      const deviceData = [];
      let j = 2;
      while (worksheet[`B${j}`]) {
        deviceData.push({
          index: j - 1,
          cellValue: worksheet[`B${j}`].v
        });
        j++;
      }
      setDeviceData(deviceData);

      const logData = [];
      let k = 2;
      while (worksheet[`C${k}`]) {
        logData.push({
          index: k - 1,
          cellValue: worksheet[`C${k}`].v
        });
        k++;
      }
      setLogData(logData);

    } catch (error) {
      console.error('读取 Excel 文件时出错:', error);
      setElapsedTime('Error');
    }
  };

  const toggleZoomOriginalImage = () => {
    setIsOriginalImageZoomed(!isOriginalImageZoomed);
  };

  const toggleZoomOutputImage = () => {
    setIsOutputImageZoomed(!isOutputImageZoomed);
  };

  return (
    <div style={{ marginLeft: '220px', padding: '20px', position: 'relative' }}>
      <BackButton />
      <div style={{ marginTop: '60px' }}>
        <h2>图像压缩演示</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, padding: '10px' }}>
            <h3 style={styles.title}>原图区</h3>
            <div
              style={{ ...styles.imageContainer, ...(isOriginalImageZoomed ? styles.zoomedImageContainer : {}) }}
              onClick={toggleZoomOriginalImage}
            >
              {selectedImage ? (
                < img src={selectedImage.src || selectedImage || URL.createObjectURL(selectedImage)} alt="Selected" style={styles.image} />
              ) : (
                < img src={originalImage} alt="Original" style={styles.image} />
              )}
            </div>
            <p style={styles.subtitle}>已选择图像信息</p >
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
                  <td>W120,E120</td>
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
                <option value="1">yolov5-v1</option>
                <option value="2">yolov5-v2</option>
                <option value="3">yolov5-v3</option>
                <option value="4">transformer-v1</option>
              </select>
            </div>
            <div>
              <label>选择设备：</label>
              <select value={device} onChange={handleDeviceChange}>
                <option value="1">极光1000</option>
                <option value="2">极光1000A</option>
                <option value="3">极光1000B</option>
                <option value="4">极光2000</option>
                <option value="5">极光5000</option>
              </select>
            </div>
          </div>
          <div style={{ flex: 1, padding: '10px' }}>
            <h3 style={styles.title}>识别结果区</h3>
            <div
              style={{ ...styles.imageContainer, ...(isOutputImageZoomed ? styles.zoomedImageContainer : {}) }}
              onClick={toggleZoomOutputImage}
            >
              {loading ? (
                <p>正在处理...</p >
              ) : outputImage ? (
                < img src={outputImage} alt="Detection" style={styles.image} />
              ) : (
                <div style={styles.emptyImageContainer}></div>
              )}
            </div>
            <h3 style={styles.subtitle}>程序运行信息</h3>
            <table border="1" style={styles.table}>
              <thead>
                <tr>
                  <th>应用名称</th>
                  <th>耗时</th>
                  <th>图像大小</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>图像压缩</td>
                  <td>{elapsedTime}</td>
                  <td>{outputImageResolution}</td>
                </tr>
              </tbody>
            </table>
            <div style={styles.buttonContainer}>
              <button style={styles.button} onClick={handleRunClick}>开始运行</button>
              <button style={styles.button}>统计结果</button>
            </div>
          </div>
          <div style={{ flex: 1, padding: '10px' }}>
            <h3 style={styles.subtitle}>目标详细信息</h3>
            <div style={styles.scrollContainer}>
              <table border="1" style={styles.table}>
                <thead>
                  <tr>
                    <th>编号</th>
                    <th>类别</th>
                    <th>位置信息</th>
                    <th>经纬度信息</th>
                    <th>时间</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.index}</td>
                      <td>{row.type}</td>
                      <td>{row.location}</td>
                      <td>{row.latlong}</td>
                      <td>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 style={styles.subtitle}>北斗信息</h3>
            <div style={styles.scrollContainer}>
              <table border="1" style={styles.table}>
                <thead>
                  <tr>
                    <th>编号</th>
                    <th>信息</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.index}</td>
                      <td>{row.cellValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 style={styles.subtitle}>运行日志</h3>
            <div style={styles.scrollContainer}>
              <table border="1" style={styles.table}>
                <thead>
                  <tr>
                    <th>编号</th>
                    <th>日志</th>
                  </tr>
                </thead>
                <tbody>
                  {logData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.index}</td>
                      <td>{row.cellValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    height: '550px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc',
    cursor: 'pointer'
  },
  zoomedImageContainer: {
    position: 'fixed',
    top: '55%',
    left: '55%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    zIndex: '1000',
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
    height: '180px',
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

export default ImageCompression;