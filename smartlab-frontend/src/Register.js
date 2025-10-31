// smartlab-frontend/src/Register.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div style={styles.container}>
      <h2 style={styles.title}>Cadastro de Usuário - SmartLab</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="ra" style={styles.label}>RA:</label>
          <input
            type="text"
            id="ra"
            value={ra}
            onChange={(e) => setRa(e.target.value)}
            required
            style={styles.input}
            placeholder="Ex: 1234 (Admin), 123456 (Aluno), 1-23456 (Professor)"
          />
          {raValidationMessage && <p style={styles.raErrorMessage}>{raValidationMessage}</p>}
          {inferredRole && !raValidationMessage && (
            <p style={styles.inferredRoleMessage}>Seu tipo de usuário será: <strong>{inferredRole}</strong></p>
          )}
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button} disabled={!inferredRole}>Registrar</button>
      </form>
      {message && <p style={message.includes('Erro') ? styles.errorMessage : styles.successMessage}>{message}</p>}
      <p style={styles.linkText}>
        Já tem uma conta?{' '}
        <span onClick={onNavigateToLogin} style={styles.link}>Faça login aqui</span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F7F9FC', /* Fundo principal */
    padding: '2rem',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#1F2933', /* Texto principal escuro */
    textShadow: '0 0 10px rgba(47, 128, 237, 0.5)', /* Efeito neon sutil */
  },
  form: {
    backgroundColor: '#FFFFFF', /* Cards e seções: branco */
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)', /* Sombra mais suave */
    width: '100%',
    maxWidth: '450px',
    border: '1px solid #E3EAF2', /* Borda cinza-azulado neutro */
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.6rem',
    fontWeight: '500',
    color: '#4B5563', /* Texto secundário */
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem',
    border: '1px solid #9CA3AF', /* Desabilitado/placeholder para borda sutil */
    borderRadius: '8px',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF', /* Fundo input branco */
    color: '#1F2933', /* Texto input escuro */
    fontSize: '1rem',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  inputFocus: {
    borderColor: '#2F80ED', /* Azul-claro profissional no foco */
    boxShadow: '0 0 10px rgba(47, 128, 237, 0.6)',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#2F80ED', /* Azul-claro profissional */
    color: '#FFFFFF', /* Texto branco para contraste */
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#256DCC', /* Azul um pouco mais escuro no hover */
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(47, 128, 237, 0.4)',
  },
  successMessage: {
    color: '#27AE60', /* Verde-claro clínico */
    marginTop: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '0 0 8px rgba(39, 174, 96, 0.5)',
  },
  errorMessage: {
    color: '#EB5757', /* Vermelho alerta */
    marginTop: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '0 0 8px rgba(235, 87, 87, 0.5)',
  },
  raErrorMessage: {
    color: '#EB5757', /* Vermelho alerta */
    fontSize: '0.8rem',
    marginTop: '0.5rem',
    marginBottom: '0',
    textShadow: '0 0 5px rgba(235, 87, 87, 0.3)',
  },
  inferredRoleMessage: {
    color: '#27AE60', /* Verde-claro clínico */
    fontSize: '0.85rem',
    marginTop: '0.5rem',
    marginBottom: '0',
    textShadow: '0 0 5px rgba(39, 174, 96, 0.3)',
  },
  linkText: {
    marginTop: '1.5rem',
    fontSize: '0.95rem',
    color: '#4B5563', /* Texto secundário */
  },
  link: {
    color: '#2F80ED', /* Azul-claro profissional para links */
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.3s ease',
  },
  linkHover: {
    color: '#256DCC',
  },
};

export default Register;