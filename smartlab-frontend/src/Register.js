// smartlab-frontend/src/Register.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Register.module.css'; // 1. Importar o CSS Module
import logo from './assets/smartlab-logo.png'; // 2. Importar o logo (ajuste este caminho se usar outro logo)

const Register = ({ onNavigateToLogin }) => {
  const [ra, setRa] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [inferredRole, setInferredRole] = useState(null);
  const [raValidationMessage, setRaValidationMessage] = useState('');

  useEffect(() => {
    let determinedRole = null;
    let validationMsg = '';

    if (ra.length > 0) {
      if (ra.match(/^\d{4}$/)) { // Ex: 1234 (ADMIN)
        determinedRole = 'ADMIN';
      } else if (ra.match(/^\d{6}$/)) { // Ex: 123456 (ALUNO)
        determinedRole = 'ALUNO';
      } else if (ra.match(/^\d-\d{1,5}$/)) { // Ex: 1-23456 (PROFESSOR)
        determinedRole = 'PROFESSOR';
      } else {
        validationMsg = 'Formato de RA inválido. Use 4 dígitos para Admin, 6 dígitos para Aluno, ou X-XXXXX para Professor.';
      }
    }

    setInferredRole(determinedRole);
    setRaValidationMessage(validationMsg);
  }, [ra]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!inferredRole) {
      setMessage('Por favor, insira um RA válido para continuar.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        ra,
        name,
        email,
        password,
        role: inferredRole,
      });

      setMessage(`Usuário ${response.data.name} (${response.data.ra}) (${response.data.role}) registrado com sucesso!`);
      setRa('');
      setName('');
      setEmail('');
      setPassword('');
      setInferredRole(null);
      setRaValidationMessage('');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`Erro: ${error.response.data}`);
      } else {
        setMessage('Erro ao registrar usuário. Verifique a conexão com o backend.');
      }
      console.error('Erro de registro:', error);
    }
  };

  return (
    // 3. Usar 'className' com os 'styles' importados
    <div className={styles.container}>
      <img src={logo} alt="SmartLab Logo" className={styles.logo} />
      <h2 className={styles.title}>Cadastro de Usuário - SmartLab</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="ra" className={styles.label}>RA:</label>
          <input
            type="text"
            id="ra"
            value={ra}
            onChange={(e) => setRa(e.target.value)}
            required
            className={styles.input}
            placeholder="Ex: 1234 (Admin), 123456 (Aluno), 1-23456 (Professor)"
          />
          {raValidationMessage && <p className={styles.raErrorMessage}>{raValidationMessage}</p>}
          {inferredRole && !raValidationMessage && (
            <p className={styles.inferredRoleMessage}>Seu tipo de usuário será: <strong>{inferredRole}</strong></p>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button} disabled={!inferredRole}>Registrar</button>
      </form>
      {message && <p className={message.includes('Erro') ? styles.errorMessage : styles.successMessage}>{message}</p>}
      <p className={styles.linkText}>
        Já tem uma conta?{' '}
        <span onClick={onNavigateToLogin} className={styles.link}>Faça login aqui</span>
      </p>
    </div>
  );
};

// 4. Remover o objeto 'const styles = { ... }' daqui.

export default Register;