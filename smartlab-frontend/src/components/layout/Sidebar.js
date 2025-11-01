// smartlab-frontend/src/components/layout/Sidebar.js
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Sidebar.module.css'; // 1. Importar o CSS Module da Sidebar

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  user,
  activeSection,
  handleNavLinkClick,
  onLogout,
  logoutIcon,
  isMobile // 2. Receber a nova prop isMobile
}) => {

  const { theme, toggleTheme } = useTheme();

  // 3. Define a classe CSS principal da sidebar (para mobile)
  const sidebarClasses = `
    ${styles.sidebar} 
    ${isMobile && isSidebarOpen ? styles.sidebarOpen : ''}
  `;

  // 4. Define o estilo do botão de toggle (para desktop)
  const toggleButtonStyle = {
    right: isSidebarOpen ? '10px' : 'auto',
    left: isSidebarOpen ? 'auto' : '20px',
    // 5. Em mobile, o botão fica fixo
    position: isMobile ? 'fixed' : 'absolute',
  };

  return (
    // 6. Aplicar a classe e remover estilos inline desnecessários
    <div 
      className={sidebarClasses} 
      style={{ width: isMobile ? '280px' : (isSidebarOpen ? '280px' : '80px') }}
    >
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={styles.sidebarToggleButton} // 7. Usar classe
        style={toggleButtonStyle} // 7. Manter estilos dinâmicos
        title={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isSidebarOpen ? '❮' : '❯'}
      </button>

      {/* 8. O conteúdo da sidebar (aberta ou fechada) agora é condicional
           apenas em 'isSidebarOpen', pois o CSS cuida da responsividade */
      }
      {isSidebarOpen ? (
        <div className={styles.sidebarContent}>
          <h2 className={styles.sidebarTitle}>SmartLab</h2>
          <p className={styles.sidebarUserInfo}>Olá, {user.name}!</p>
          <p className={styles.sidebarDetail}>RA: {user.ra}</p>
          <p className={styles.sidebarDetail}>Email: {user.email}</p>
          <p className={styles.sidebarDetail}>Papel: <strong className={styles.roleHighlight}>{user.role}</strong></p>

          <nav className={styles.navbar}>
            {user.role === 'ALUNO' && (
              <>
                <a href="#top" className={`${styles.navLink} ${activeSection === 'top' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#top')}>Visão Geral</a>
                <a href="#novo-agendamento" className={`${styles.navLink} ${activeSection === 'novo-agendamento' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#novo-agendamento')}>Novo Agendamento</a>
                <a href="#meus-agendamentos" className={`${styles.navLink} ${activeSection === 'meus-agendamentos' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#meus-agendamentos')}>Meus Agendamentos</a>
                <a href="#proximos-agendamentos" className={`${styles.navLink} ${activeSection === 'proximos-agendamentos' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#proximos-agendamentos')}>Próximos</a>
              </>
            )}
            {user.role === 'PROFESSOR' && (
              <>
                <a href="#top" className={`${styles.navLink} ${activeSection === 'top' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#top')}>Visão Geral</a>
                <a href="#pendentes" className={`${styles.navLink} ${activeSection === 'pendentes' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#pendentes')}>Pendentes</a>
                <a href="#meus-agendamentos" className={`${styles.navLink} ${activeSection === 'meus-agendamentos' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#meus-agendamentos')}>Meus Agendamentos</a>
                <a href="#proximos-agendamentos" className={`${styles.navLink} ${activeSection === 'proximos-agendamentos' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#proximos-agendamentos')}>Próximos</a>
              </>
            )}
            {user.role === 'ADMIN' && (
              <>
                <a href="#top" className={`${styles.navLink} ${activeSection === 'top' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#top')}>Visão Geral</a>
                <a href="#analise" className={`${styles.navLink} ${activeSection === 'analise' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#analise')}>Análise</a>
                <a href="#pendentes" className={`${styles.navLink} ${activeSection === 'pendentes' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#pendentes')}>Pendentes</a>
                <a href="#todos-agendamentos" className={`${styles.navLink} ${activeSection === 'todos-agendamentos' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#todos-agendamentos')}>Todos Agendamentos</a>
                <a href="#gerenciamento" className={`${styles.navLink} ${activeSection === 'gerenciamento' ? styles.navLinkActive : ''}`} onClick={() => handleNavLinkClick('#gerenciamento')}>Gerenciamento</a>
              </>
            )}
          </nav>

          <button
            onClick={toggleTheme}
            className={styles.themeToggleButton}
            title={`Mudar para Tema ${theme === 'light' ? 'Escuro' : 'Claro'}`}
          >
            {theme === 'light' ? '🌙 Tema Escuro' : '☀️ Tema Claro'}
          </button>

          <button onClick={onLogout} className={styles.logoutButtonWithIcon} title="Sair">
            <img 
              src={logoutIcon} 
              alt="Sair" 
              className={`${styles.logoutIcon} theme-icon-invert ${styles.themeIconInvert}`} /* Adiciona classe local para hover */
            />
          </button>
        </div>
      ) : (
        // Sidebar fechada
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', paddingTop: '5rem' }}>
          
          <button
            onClick={toggleTheme}
            title={`Mudar para Tema ${theme === 'light' ? 'Escuro' : 'Claro'}`}
            className={`${styles.themeToggleButton} ${styles.themeToggleButtonClosed}`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button onClick={onLogout} className={styles.logoutButtonWithIcon} style={{ marginTop: '1rem', marginBottom: '1rem', width: '40px', height: '40px' }} title="Sair">
            <img 
              src={logoutIcon} 
              alt="Sair" 
              className={`${styles.logoutIcon} theme-icon-invert ${styles.themeIconInvert}`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;