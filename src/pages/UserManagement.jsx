import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';

const styles = {
  container: {
    marginLeft: '220px',
    padding: '20px',
    position: 'relative',
  },
  header: {
    marginTop: '60px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  deleteButton: {
    background: '#ff4d4f',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  deleteButtonHover: {
    background: '#ff7875',
  },
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState(null);

  useEffect(() => {
    fetch('http://172.16.100.104:5003/api/users')  // 替换为你的服务器IP和端口
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const deleteUser = (userId) => {
    fetch(`http://172.16.100.104:5003/api/users/${userId}`, {  // 替换为你的服务器IP和端口
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
        } else {
          console.error('Error deleting user');
        }
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div style={styles.container}>
      <BackButton />
      <div style={styles.header}>
        <h2>用户管理</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>用户名</th>
              <th style={styles.th}>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>
                  <button
                    style={{
                      ...styles.deleteButton,
                      ...(hoveredUserId === user.id ? styles.deleteButtonHover : {}),
                    }}
                    onClick={() => deleteUser(user.id)}
                    onMouseEnter={() => setHoveredUserId(user.id)}
                    onMouseLeave={() => setHoveredUserId(null)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
