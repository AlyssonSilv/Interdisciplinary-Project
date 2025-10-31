// smartlab-frontend/src/Login.js
import React, { useState } from 'react';
import axios from 'axios';

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
    <div style={styles.container}>
      <h2 style={styles.title}>Login - SmartLab</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="loginRa" style={styles.label}>RA:</label>
          <input
            type="text"
            id="loginRa"
            value={ra}
            onChange={(e) => setRa(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="loginPassword" style={styles.label}>Senha:</label>
          <input
            type="password"
            id="loginPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
      {message && <p style={message.includes('Erro') ? styles.errorMessage : styles.successMessage}>{message}</p>}
      <p style={styles.linkText}>
        Não tem uma conta?{' '}
        <span onClick={onNavigateToRegister} style={styles.link}>Cadastre-se aqui</span>
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
        textShadow: '0 0 10px rgba(47, 128, 237, 0.5)', /* Efeito neon sutil baseado no azul primário */
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
    }
};

export default Login;