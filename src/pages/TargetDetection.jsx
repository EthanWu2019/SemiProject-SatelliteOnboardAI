import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import originalImage from '../assets/original.jpg';
import axios from 'axios'; // 用于前端与后端通信
import * as XLSX from 'xlsx';// 读取excel

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
  const [isOriginalImageZoomed, setIsOriginalImageZoomed] = useState(false);
  const [isOutputImageZoomed, setIsOutputImageZoomed] = useState(false);

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
        responseType: 'blob' // 确保接收到的是二进制数据
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
  const [elapsedTime, setElapsedTime] = useState('占位符');
  const [tableData, setTableData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [log, setLog] = useState('');

  const handleButtonClick = async () => {
    try {
      console.log('开始读取文件');
      setLog('开始读取文件');
      // 读取 result.xlsx 文件
      const response = await fetch('/result.xlsx');
      if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      console.log('Excel 文件读取成功', workbook);
      setLog(prevLog => prevLog + '\nExcel 文件读取成功');

      // 数据在第一个工作表的 B1 单元格
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      console.log('工作表内容', worksheet);
      setLog(prevLog => prevLog + `\n工作表内容: ${JSON.stringify(worksheet)}`);
      const elapsedTimeCell = worksheet['B1'];
      const elapsedTime = elapsedTimeCell ? elapsedTimeCell.v : 'N/A';

      console.log('读取的耗时数据', elapsedTime);
      setLog(prevLog => prevLog + `\n读取的耗时数据: ${elapsedTime}`);
      setElapsedTime(elapsedTime);

      const worksheet2 = workbook.Sheets[workbook.SheetNames[1]];//更换表格

      const tableData = [];
      let i = 2;  // 数据从第2行开始
      while (true) {
        const indexCell = [i-1];
        const typeCell = worksheet2[`A${i}`];
        const locationCell = worksheet2[`B${i}`];
        const latlongCell = worksheet2[`C${i}`];

        if (!typeCell || !locationCell || !latlongCell) {
            break;  // 当某一列的数据为空时停止读取
        }

        tableData.push({
            index: indexCell,
            type: typeCell.v,
            location: locationCell.v,
            latlong: latlongCell.v
        });
        i++;
      }
      setTableData(tableData);

      const worksheet3 = workbook.Sheets[workbook.SheetNames[2]];//更换表格
    
      
      const logData = [];
          let j = 1;  // 从第一行开始读取
          while (true) {
              const logCell = worksheet3[`A${j}`];

              if (!logCell) {
                  break;  // 当单元格为空时停止读取
              }

            //  console.log(`读取的单元格 A${j}: ${logCell.v}`);
              logData.push(logCell.v);
              j++;
          }
          setLogData(logData);
    } catch (error) {
        console.error('读取 Excel 文件时出错:', error);
        setLog(prevLog => prevLog + `\n读取 Excel 文件时出错: ${error.message}`);
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
        <h2>目标检测演示</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 第一部分：原图区 */}
          <div style={{ flex: 1, padding: '10px' }}>
            <h3 style={styles.title}>原图区</h3>
            <div
              style={{ ...styles.imageContainer, ...(isOriginalImageZoomed ? styles.zoomedImageContainer : {}) }}
              onClick={toggleZoomOriginalImage}
            >
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
                <option value="1">算法1</option>
                <option value="2">算法2</option>
              </select>
            </div>
          </div>
          {/* 第二部分：识别选取区 */}
          <div style={{ flex: 1, padding: '10px' }}>
            <h3 style={styles.title}>识别选取区</h3>
            <div
              style={{ ...styles.imageContainer, ...(isOutputImageZoomed ? styles.zoomedImageContainer : {}) }}
              onClick={toggleZoomOutputImage}
            >
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
                  <th>耗时</th>
                  <th>其他</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>目标检测</td>
                  <td>YOLOv5</td>
                  <td>{elapsedTime}</td>
                  <td>占位符2</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 第三部分：目标统计信息 */}
          <div style={{ flex: 1, padding: '10px' }}>
            <h3 style={styles.title}>目标统计信息</h3>
            <table border="1" style={styles.table}>
              <tbody>
                {logData.map((log, index) => (
                    <tr key={index}>
                        <td>{log}</td>
                    </tr>
                ))}
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
                    {tableData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.index}</td>
                        <td>{row.type}</td>
                        <td>{row.location}</td>
                        <td>{row.latlong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            {/* 底部按钮 */}
            <div style={styles.buttonContainer}>
              <button style={styles.button} onClick={handleRunClick}>开始运行</button>
              <button style={styles.button} onClick={handleButtonClick}>开始update</button>
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
