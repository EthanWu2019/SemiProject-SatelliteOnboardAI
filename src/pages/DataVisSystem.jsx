import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import io from 'socket.io-client';
import BackButton from '../components/BackButton';

const DataVisSystem = () => {
  const [systemInfo, setSystemInfo] = useState({});
  const socket = useMemo(() => io('http://172.16.100.104:5000'), []);

  useEffect(() => {
    const fetchData = () => {
      console.log('Requesting system info');
      socket.emit('request_info');
    };

    socket.on('connect', () => {
      console.log('Connected to server');
      fetchData();
    });

    socket.on('system_info', (data) => {
      console.log('Received system info:', data);  // 添加日志记录
      setSystemInfo(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    const interval = setInterval(() => {
      fetchData();
    }, 5000); // 每5秒钟获取一次数据

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    console.log('Updated system info state:', systemInfo);  // 添加日志记录
  }, [systemInfo]);

  const data = {
    labels: ['CPU 使用率', '内存使用率'],
    datasets: [
      {
        label: '使用率 (%)',
        data: [systemInfo['cpu-usage'], systemInfo['memory-usage']],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ marginLeft: '220px', padding: '20px', position: 'relative' }}>
      <BackButton />
      <div style={{ marginTop: '60px' }}>
        <h2>数据可视化系统</h2>
        <p>这里是数据可视化系统内容。</p>
        {systemInfo['cpu-usage'] !== undefined && (
          <Bar data={data} options={options} />
        )}
        <div style={{ marginTop: '20px' }}>
          <h3>系统详细信息</h3>
          <ul>
            <li>平台: {systemInfo.platform}</li>
            <li>平台发布: {systemInfo['platform-release']}</li>
            <li>平台版本: {systemInfo['platform-version']}</li>
            <li>架构: {systemInfo.architecture}</li>
            <li>主机名: {systemInfo.hostname}</li>
            <li>IP地址: {systemInfo['ip-address']}</li>
            <li>CPU温度: {systemInfo['cpu-temp']}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataVisSystem;
