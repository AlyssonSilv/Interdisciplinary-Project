// smartlab-frontend/src/components/layout/Sidebar.js
import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // <- 1. IMPORTAR

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  user,
  activeSection,
  handleNavLinkClick,
  onLogout,
  logoutIcon,
  styles
}) => {

  const { theme, toggleTheme } = useTheme(); // <- 2. USAR O HOOK

  return (
    <div style={{ ...styles.sidebar, width: isSidebarOpen ? '280px' : '80px' }}>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ ...styles.sidebarToggleButton, right: isSidebarOpen ? '10px' : 'auto', left: isSidebarOpen ? 'auto' : '20px' }}
        title={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isSidebarOpen ? '❮' : '❯'}
      </button>

      {isSidebarOpen ? (
        <div style={styles.sidebarContent}>
          <h2 style={styles.sidebarTitle}>SmartLab</h2>
          <p style={styles.sidebarUserInfo}>Olá, {user.name}!</p>
          <p style={styles.sidebarDetail}>RA: {user.ra}</p>
          <p style={styles.sidebarDetail}>Email: {user.email}</p>
          <p style={styles.sidebarDetail}>Papel: <strong style={styles.roleHighlight}>{user.role}</strong></p>

          <nav style={styles.navbar}>
            {user.role === 'ALUNO' && (
              <>
                <a href="#top" style={{ ...styles.navLink, ...(activeSection === 'top' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#top')}>Visão Geral</a>
                <a href="#novo-agendamento" style={{ ...styles.navLink, ...(activeSection === 'novo-agendamento' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#novo-agendamento')}>Novo Agendamento</a>
                <a href="#meus-agendamentos" style={{ ...styles.navLink, ...(activeSection === 'meus-agendamentos' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#meus-agendamentos')}>Meus Agendamentos</a>
                <a href="#proximos-agendamentos" style={{ ...styles.navLink, ...(activeSection === 'proximos-agendamentos' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#proximos-agendamentos')}>Próximos</a>
              </>
            )}
            {user.role === 'PROFESSOR' && (
              <>
                <a href="#top" style={{ ...styles.navLink, ...(activeSection === 'top' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#top')}>Visão Geral</a>
                <a href="#pendentes" style={{ ...styles.navLink, ...(activeSection === 'pendentes' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#pendentes')}>Pendentes</a>
                <a href="#meus-agendamentos" style={{ ...styles.navLink, ...(activeSection === 'meus-agendamentos' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#meus-agendamentos')}>Meus Agendamentos</a>
                <a href="#proximos-agendamentos" style={{ ...styles.navLink, ...(activeSection === 'proximos-agendamentos' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#proximos-agendamentos')}>Próximos</a>
              </>
            )}
            {user.role === 'ADMIN' && (
              <>
                <a href="#top" style={{ ...styles.navLink, ...(activeSection === 'top' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#top')}>Visão Geral</a>
                <a href="#analise" style={{ ...styles.navLink, ...(activeSection === 'analise' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#analise')}>Análise</a>
                <a href="#pendentes" style={{ ...styles.navLink, ...(activeSection === 'pendentes' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#pendentes')}>Pendentes</a>
                <a href="#todos-agendamentos" style={{ ...styles.navLink, ...(activeSection === 'todos-agendamentos' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#todos-agendamentos')}>Todos Agendamentos</a>
                <a href="#gerenciamento" style={{ ...styles.navLink, ...(activeSection === 'gerenciamento' ? styles.navLinkActive : {}) }} onClick={() => handleNavLinkClick('#gerenciamento')}>Gerenciamento</a>
              </>
            )}
          </nav>

          {/* 3. ADICIONAR BOTÃO DE TEMA (ABERTO) */}
          <button
            onClick={toggleTheme}
            style={styles.themeToggleButton}
            title={`Mudar para Tema ${theme === 'light' ? 'Escuro' : 'Claro'}`}
          >
            {theme === 'light' ? '🌙 Tema Escuro' : '☀️ Tema Claro'}
          </button>

          <button onClick={onLogout} style={styles.logoutButtonWithIcon} title="Sair">
            {/* *** ALTERAÇÃO APLICADA AQUI *** */}
            <img 
              src={logoutIcon} 
              alt="Sair" 
              style={styles.logoutIcon} 
              className="theme-icon-invert" /* <- CLASSE ADICIONADA */
            />
          </button>
        </div>
      ) : (
        // Sidebar fechada
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', paddingTop: '5rem' }}>

          {/* 4. ADICIONAR BOTÃO DE TEMA (FECHADO) */}
          <button
            onClick={toggleTheme}
            title={`Mudar para Tema ${theme === 'light' ? 'Escuro' : 'Claro'}`}
            style={{ ...styles.themeToggleButton, ...styles.themeToggleButtonClosed }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button onClick={onLogout} style={{ ...styles.logoutButtonWithIcon, marginTop: '1rem', marginBottom: '1rem', width: '40px', height: '40px' }} title="Sair">
            {/* Você já tinha aplicado corretamente aqui */}
            <img 
              src={logoutIcon} 
              alt="Sair" 
              style={styles.logoutIcon}
              className="theme-icon-invert"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;