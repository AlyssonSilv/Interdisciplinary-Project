// smartlab-frontend/src/Dashboard.js
import React, { useState, useEffect, useRef } from 'react'; 
// ... (imports inalterados)
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, ArcElement,
} from 'chart.js';
import expandIcon from './assets/expand-icon.png';
import collapseIcon from './assets/collapse-icon.png';
import logoutIcon from './assets/sair.png';
import styles from './Dashboard.styles.js';
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
  
  const {
    loading, error, refreshDashboardData,
    ...dataProps
  } = useDashboardData(user, onLogout);

  const actionProps = useBookingActions(refreshDashboardData);
  const formProps = useBookingForm(refreshDashboardData);
  const adminProps = useAdminManagement(refreshDashboardData);

  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('top');
  const sectionRefs = useRef({});
  const mainContentRef = useRef(null);
  
  // Estados de UI
  const [showMyBookingsSection, setShowMyBookingsSection] = useState(true);
  const [showPendingBookingsSection, setShowPendingBookingsSection] = useState(true);
  const [showAllBookingsSection, setShowAllBookingsSection] = useState(true);
  const [showUpcomingBookingsSection, setShowUpcomingBookingsSection] = useState(true);
  const [showNewBookingSection, setShowNewBookingSection] = useState(true);
  const [showAnalyticsSection, setShowAnalyticsSection] = useState(true);

  // Agrupado para ALUNO
  const alunoUiState = {
    showMyBookingsSection, setShowMyBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection,
    showNewBookingSection, setShowNewBookingSection,
  };
  
  // Agrupado para PROFESSOR
  const profUiState = {
    showMyBookingsSection, setShowMyBookingsSection,
    showPendingBookingsSection, setShowPendingBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection,
    // showNewBookingSection será controlado dentro do ProfessorDashboard
  };

  // Agrupado para ADMIN
  const adminUiState = {
    showPendingBookingsSection, setShowPendingBookingsSection,
    showAllBookingsSection, setShowAllBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection,
    showAnalyticsSection, setShowAnalyticsSection,
  };
  
  const icons = { collapseIcon, expandIcon };

  // ... (hooks de efeito e scroll inalterados) ...
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
  };


  if (loading) {
    return <div style={styles.loading}>Carregando dashboard...</div>;
  }

  if (error) {
     return (
      <div style={styles.dashboardLayout}>
          <div style={{ ...styles.sidebar, width: '80px', padding: '1rem 0' }}>
               <button onClick={onLogout} style={{...styles.logoutButtonWithIcon, marginTop: 'auto', marginBottom: '1rem', width: '40px', height: '40px' }} title="Sair">
                 <img src={logoutIcon} alt="Sair" style={styles.logoutIcon} className="theme-icon-invert"/>
              </button>
          </div>
          <div style={{ ...styles.mainContent, paddingLeft: '100px' }}>
             <h2 id="top" style={styles.title} ref={el => sectionRefs.current['top'] = el}>Erro ao Carregar</h2>
             <p style={styles.errorMessage}>{error}</p>
             <button onClick={onLogout} style={{...styles.logoutButton, backgroundColor: 'var(--primary-color)', marginTop: '1rem', width: 'auto', alignSelf: 'center'}}>Voltar para Login</button>
          </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardLayout}>
      
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        user={user}
        activeSection={activeSection}
        handleNavLinkClick={handleNavLinkClick}
        onLogout={onLogout}
        logoutIcon={logoutIcon}
        styles={styles}
      />

      <div ref={mainContentRef} style={{ ...styles.mainContent, paddingLeft: isSidebarOpen ? '300px' : '100px' }}>
        <h2 id="top" style={styles.title} ref={el => sectionRefs.current['top'] = el}>Dashboard</h2>

        {user.role === 'ALUNO' && (
          <AlunoDashboard
            styles={styles}
            icons={icons}
            sectionRefs={sectionRefs}
            user={user}
            dataProps={dataProps}
            formProps={formProps}
            actionProps={actionProps}
            uiState={alunoUiState} // Estado de UI específico
            loading={loading}
          />
        )}
        
        {user.role === 'PROFESSOR' && (
          <ProfessorDashboard
            styles={styles}
            icons={icons}
            sectionRefs={sectionRefs}
            user={user}
            dataProps={dataProps}
            actionProps={actionProps}
            uiState={profUiState} // Estado de UI específico
            formProps={formProps} // <- PROP ADICIONADA
            loading={loading}     // <- PROP ADICIONADA
          />
        )}
        
        {user.role === 'ADMIN' && (
          <AdminDashboard
            styles={styles}
            icons={icons}
            sectionRefs={sectionRefs}
            user={user}
            dataProps={dataProps}
            actionProps={actionProps}
            adminProps={adminProps}
            uiState={adminUiState} // Estado de UI específico
            theme={theme}
          />
        )}

      </div>
    </div>
  );
};

export default Dashboard;