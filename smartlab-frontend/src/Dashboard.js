// smartlab-frontend/src/Dashboard.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
// ... (imports de chart.js, assets, hooks, etc. inalterados)
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, ArcElement,
} from 'chart.js';
import expandIcon from './assets/expand-icon.png';
import collapseIcon from './assets/collapse-icon.png';
import logoutIcon from './assets/sair.png';

// 1. REMOVER a importação de styles.js
// import styles from './Dashboard.styles.js'; 
// 2. ADICIONAR importações de CSS Module
import commonStyles from './styles/Common.module.css';
import dashStyles from './Dashboard.module.css';

import Sidebar from './components/layout/Sidebar';
import AlunoDashboard from './components/dashboard/AlunoDashboard';
import ProfessorDashboard from './components/dashboard/ProfessorDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import { useDashboardData } from './hooks/useDashboardData';
import { useBookingForm } from './hooks/useBookingForm';
import { useBookingActions } from './hooks/useBookingActions';
import { useAdminManagement } from './hooks/useAdminManagement';
import { useTheme } from './context/ThemeContext';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, ArcElement
);

const Dashboard = ({ user, onLogout }) => {
  
  // ... (hooks inalterados)
  const {
    loading, error, refreshDashboardData,
    ...dataProps
  } = useDashboardData(user, onLogout);

  const actionProps = useBookingActions(refreshDashboardData);
  const formProps = useBookingForm(refreshDashboardData);
  const adminProps = useAdminManagement(refreshDashboardData);

  const { theme } = useTheme();
  
  // 3. Lógica de Responsividade
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768); // Aberta em desktop, fechada em mobile
  
  const [activeSection, setActiveSection] = useState('top');
  const sectionRefs = useRef({});
  const mainContentRef = useRef(null);
  
  // ... (Estados de UI inalterados)
  const [showMyBookingsSection, setShowMyBookingsSection] = useState(true);
  const [showPendingBookingsSection, setShowPendingBookingsSection] = useState(true);
  const [showAllBookingsSection, setShowAllBookingsSection] = useState(true);
  const [showUpcomingBookingsSection, setShowUpcomingBookingsSection] = useState(true);
  const [showNewBookingSection, setShowNewBookingSection] = useState(true);
  const [showAnalyticsSection, setShowAnalyticsSection] = useState(true);
  
  // ... (Agrupamentos de UI inalterados)
  const alunoUiState = {
    showMyBookingsSection, setShowMyBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection,
    showNewBookingSection, setShowNewBookingSection,
  };
  const profUiState = {
    showMyBookingsSection, setShowMyBookingsSection,
    showPendingBookingsSection, setShowPendingBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection,
  };
  const adminUiState = {
    showPendingBookingsSection, setShowPendingBookingsSection,
    showAllBookingsSection, setShowAllBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection,
    showAnalyticsSection, setShowAnalyticsSection,
  };
  
  const icons = { collapseIcon, expandIcon };

  // 4. Efeito para lidar com redimensionamento (responsividade)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Se estava no desktop e foi para mobile, fecha a sidebar
      // Se estava no mobile e foi para desktop, abre a sidebar
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // ... (useEffect de scroll inalterados) ...
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSection = 'top';
      const sectionIds = ['top', 'analise', 'pendentes', 'todos-agendamentos', 'gerenciamento', 'novo-agendamento', 'meus-agendamentos', 'proximos-agendamentos'];

      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          if ((scrollPosition >= elementTop && scrollPosition < elementBottom) || (window.scrollY >= elementTop && window.scrollY < elementBottom)) {
            currentSection = id;
          }
        }
      });
      setActiveSection(currentSection);
    };

    let scrollTimeout;
    const throttledScrollHandler = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
    };
    window.addEventListener('scroll', throttledScrollHandler);
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleNavLinkClick = (sectionIdWithHash) => {
      const sectionId = sectionIdWithHash.substring(1);
      setActiveSection(sectionId);
      // 5. Se for mobile, fecha a sidebar ao clicar no link
      if (isMobile) {
        setIsSidebarOpen(false);
      }
  };


  // 6. Passa a usar as classes do CSS Module
  if (loading) {
    return <div className={dashStyles.loading}>Carregando dashboard...</div>;
  }

  // 7. Atualiza o layout de Erro
  if (error) {
     return (
      <div className={dashStyles.dashboardLayout}>
          {/* O Sidebar.js ainda não foi refatorado, então passamos styles vazios por enquanto */}
          <div style={{ width: '80px', padding: '1rem 0', backgroundColor: 'var(--bg-color-alt)', boxShadow: '4px 0 15px var(--shadow-color)', position: 'fixed', height: '100%', top: 0, left: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <button onClick={onLogout} style={{marginTop: 'auto', marginBottom: '1rem', width: '40px', height: '40px', border: '1px solid var(--error-color)', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', backgroundColor: 'transparent' }} title="Sair">
                 <img src={logoutIcon} alt="Sair" style={{width: '24px', height: '24px'}} className="theme-icon-invert"/>
              </button>
          </div>
          <div className={dashStyles.mainContent} style={{ paddingLeft: '100px' }}>
             <h2 id="top" className={dashStyles.title} ref={el => sectionRefs.current['top'] = el}>Erro ao Carregar</h2>
             <p className={commonStyles.errorMessage}>{error}</p>
             <button onClick={onLogout} className={commonStyles.simpleActionButton} style={{backgroundColor: 'var(--primary-color)', marginTop: '1rem', width: 'auto', alignSelf: 'center'}}>Voltar para Login</button>
          </div>
      </div>
    );
  }

  // 8. Calcula o padding-left dinâmico
  const mainContentPadding = isMobile ? '1rem' : (isSidebarOpen ? '300px' : '100px');

  return (
    <div className={dashStyles.dashboardLayout}>
      
      {/* 9. Adiciona o Backdrop para mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className={`${dashStyles.mobileBackdrop} ${isSidebarOpen ? dashStyles.mobileBackdropVisible : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        user={user}
        activeSection={activeSection}
        handleNavLinkClick={handleNavLinkClick}
        onLogout={onLogout}
        logoutIcon={logoutIcon}
        // 10. Passa a prop isMobile
        isMobile={isMobile}
      />

      <div 
        ref={mainContentRef} 
        className={dashStyles.mainContent} 
        // 11. Aplica o padding dinâmico
        style={{ paddingLeft: mainContentPadding }}
      >
        <h2 id="top" className={dashStyles.title} ref={el => sectionRefs.current['top'] = el}>Dashboard</h2>

        {/* 12. Passa commonStyles para os filhos em vez de 'styles' */}
        {user.role === 'ALUNO' && (
          <AlunoDashboard
            commonStyles={commonStyles}
            icons={icons}
            sectionRefs={sectionRefs}
            user={user}
            dataProps={dataProps}
            formProps={formProps}
            actionProps={actionProps}
            uiState={alunoUiState}
            loading={loading}
          />
        )}
        
        {user.role === 'PROFESSOR' && (
          <ProfessorDashboard
            commonStyles={commonStyles}
            icons={icons}
            sectionRefs={sectionRefs}
            user={user}
            dataProps={dataProps}
            actionProps={actionProps}
            uiState={profUiState}
            formProps={formProps}
            loading={loading}
          />
        )}
        
        {user.role === 'ADMIN' && (
          <AdminDashboard
            commonStyles={commonStyles}
            icons={icons}
            sectionRefs={sectionRefs}
            user={user}
            dataProps={dataProps}
            actionProps={actionProps}
            adminProps={adminProps}
            uiState={adminUiState}
            theme={theme}
          />
        )}

      </div>
    </div>
  );
};

export default Dashboard;