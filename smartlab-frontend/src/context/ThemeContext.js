// smartlab-frontend/src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Criar o Contexto
const ThemeContext = createContext();

// 2. Criar o Provedor (Componente que "fornece" o tema)
// Note o "export const" aqui. Isso corrige o erro "was not found".
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hook customizado para facilitar o uso
// Note o "export const" aqui também.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};