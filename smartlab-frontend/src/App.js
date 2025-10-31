// smartlab-frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify'; // <- 1. IMPORTAR O COMPONENTE
import 'react-toastify/dist/ReactToastify.css'; // <- 2. IMPORTAR O CSS

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // ... (lógica do currentUser inalterada) ...
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('jwtToken');
    if (savedUser && savedToken) {
      return { ...JSON.parse(savedUser), token: savedToken };
    }
    return null;
  });

  const [currentScreen, setCurrentScreen] = useState(() => {
    // ... (lógica do currentScreen inalterada) ...
    return localStorage.getItem('jwtToken') ? 'dashboard' : 'login';
  });

  // ... (useEffect inalterado) ...
  useEffect(() => {
    if (currentUser && currentUser.token) {
      const userToSave = { ...currentUser };
      delete userToSave.token;
      localStorage.setItem('currentUser', JSON.stringify(userToSave));
      localStorage.setItem('jwtToken', currentUser.token);
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('jwtToken');
    }
  }, [currentUser]);

  // ... (handleLoginSuccess inalterado) ...
  const handleLoginSuccess = (loginResponse) => {
    const user = {
      id: loginResponse.id,
      ra: loginResponse.ra,
      name: loginResponse.name,
      email: loginResponse.email,
      role: loginResponse.role,
      token: loginResponse.token,
    };
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  // ... (handleLogout inalterado) ...
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  // ... (renderScreen inalterado) ...
  const renderScreen = () => {
    if (currentUser) {
      return <Dashboard user={currentUser} onLogout={handleLogout} />;
    }
    
    if (currentScreen === 'register') {
      return <Register onNavigateToLogin={() => setCurrentScreen('login')} />;
    } else {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setCurrentScreen('register')}
        />
      );
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        {renderScreen()}
        {/* 3. ADICIONAR O CONTAINER AQUI */}
        {/* Ele vai ouvir os 'toasts' e usar o tema do <body> */}
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </ThemeProvider>
  );
}

export default App;