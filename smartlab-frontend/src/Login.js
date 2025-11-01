// smartlab-frontend/src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css'; // 1. Importar o CSS Module
import logo from './assets/smartlab-logo.png';// 2. Importar o logo (ajuste este caminho se usar outro logo)

const Login = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', {
        ra,
        password,
      });

      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }

      setMessage('Login bem-sucedido!');
      setRa('');
      setPassword('');

    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`Erro no login: ${error.response.data.message || error.response.data.error || 'Credenciais inválidas.'}`);
      } else {
        setMessage('Erro de conexão ou servidor. Tente novamente.');
      }
      console.error('Erro de login:', error);
    }
  };

  return (
    // 3. Usar 'className' com os 'styles' importados
    <div className={styles.container}>
      <img src={logo} alt="SmartLab Logo" className={styles.logo} />
      <h2 className={styles.title}>Login - SmartLab</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="loginRa" className={styles.label}>RA:</label>
          <input
            type="text"
            id="loginRa"
            value={ra}
            onChange={(e) => setRa(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="loginPassword" className={styles.label}>Senha:</label>
          <input
            type="password"
            id="loginPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Entrar</button>
      </form>
      {message && <p className={message.includes('Erro') ? styles.errorMessage : styles.successMessage}>{message}</p>}
      <p className={styles.linkText}>
        Não tem uma conta?{' '}
        <span onClick={onNavigateToRegister} className={styles.link}>Cadastre-se aqui</span>
      </p>
    </div>
  );
};

// 4. Remover o objeto 'const styles = { ... }' daqui.

export default Login;