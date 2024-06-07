import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css'; // 导入CSS文件

function BackButton (){
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      返回
      <span className="ripple"></span>
    </button>
  );
};

export default BackButton;
