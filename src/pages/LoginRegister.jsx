import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StarSkyBackground from '../components/StarSkyBackground';
import { useAuth } from './AuthContext';

const styles = {
  loginRegisterWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginRegisterContainer: {
    background: 'rgba(240, 240, 240, 0.7)',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    marginBottom: '10px',
    fontSize: '16px',
    color: '#333',
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: 'calc(100% - 3px)',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    outline: 'none',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  clearBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#999',
  },
  togglePasswordBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#999',
  },
  btn: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    background: '#007bff',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnHover: {
    background: '#0056b3',
  },
  rocket: {
    marginLeft: '10px',
    transition: 'transform 4s cubic-bezier(0.3, 0, 1, 1)',
  },
  rocketFly: {
    transform: 'translate(2000px, -2000px) scale(10)',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '20px',
    cursor: 'pointer',
    color: '#333',
  },
  toggleTextSpan: {
    color: '#007bff',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  },
  toggleTextSpanHover: {
    color: '#0056b3',
  },
};

const LoginRegister = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [btnText, setBtnText] = useState('登录');
  const [rocketFly, setRocketFly] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setBtnText(isLogin ? '注册' : '登录');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    const response = await fetch(`http://172.16.100.104:5003/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (username === 'admin' && password === 'admin') {
      login();
      navigate('/Admin_Dashboard');
      setRocketFly(true);
    } else {
      if (response.ok) {
        if (isLogin) {
          login(); // Set authentication state
          navigate('/Home'); // Navigate to user home page
        } else {
          alert('Registration successful');
          setIsLogin(true);
          setBtnText('登录');
        }
        setRocketFly(true);
      } else {
        alert(result.error);
      }
    }

  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = styles.btnHover.background;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = styles.btn.background;
  };

  const handleClearUsername = () => {
    setUsername('');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const starSkyBackground = useMemo(() => <StarSkyBackground />, []);

  return (
    <div style={styles.loginRegisterWrapper}>
      {starSkyBackground}
      <div style={styles.loginRegisterContainer}>
        <h2 style={{ color: '#333' }}>中科天算星载智能机</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>{isLogin ? '用户名' : '你未来的用户名'}</label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                placeholder={isLogin ? '请输入用户名' : '编一个用户名'}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
              {username && (
                <button
                  type="button"
                  style={styles.clearBtn}
                  onClick={handleClearUsername}
                >
                  ✖
                </button>
              )}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>{isLogin ? '密码' : '你未来的密码'}</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? '请输入密码' : '请编一个密码'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <button
                type="button"
                style={styles.togglePasswordBtn}
                onClick={toggleShowPassword}
              >
                {showPassword ? '🙉' : '🙈'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            style={styles.btn}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {btnText}
            <span
              style={{
                ...styles.rocket,
                ...(rocketFly ? styles.rocketFly : {}),
              }}
            >
              🛰️
            </span>
          </button>
        </form>
        <p style={styles.toggleText}>
          {isLogin ? '没有账号？' : '已有账号？'}{' '}
          <span
            onClick={toggleForm}
            style={styles.toggleTextSpan}
            onMouseEnter={(e) => (e.target.style.color = styles.toggleTextSpanHover.color)}
            onMouseLeave={(e) => (e.target.style.color = styles.toggleTextSpan.color)}
          >
            {isLogin ? '注册' : '登录'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
