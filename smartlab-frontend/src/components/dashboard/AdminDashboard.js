// smartlab-frontend/src/components/dashboard/AdminDashboard.js
import React, { useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import BookingList from '../ui/BookingList';
import LaboratoryForm from '../forms/LaboratoryForm';
import PeripheralForm from '../forms/PeripheralForm';
import EmptyState from '../ui/EmptyState';
import commonStyles from '../../styles/Common.module.css';
import styles from './AdminDashboard.module.css';

const AdminDashboard = ({
  commonStyles,
  icons,
  sectionRefs,
  user,
  dataProps,
  actionProps,
  adminProps,
  uiState,
  theme
}) => {

  const {
    stats,
    analyticsData,
    analyticsError,
    pendingBookings,
    allBookings,
    upcomingBookings,
    allLaboratories,
  } = dataProps;
  const { handleApproveRejectBooking, handleDeleteBooking } = actionProps;
  const {
    showManageLabs, setShowManageLabs,
    showManagePeripherals, setShowManagePeripherals,
    currentLaboratory, setCurrentLaboratory,
    currentPeripheral, setCurrentPeripheral,
    showLabForm, setShowLabForm,
    showPeripheralForm, setShowPeripheralForm,
    peripheralsOfCurrentLab,
    isPeripheralsLoading,
    handleCreateOrUpdateLab,
    handleDeleteLab,
    handleViewPeripherals,
    handleCreateOrUpdatePeripheral,
    handleDeletePeripheral,
  } = adminProps;
  const {
    showAnalyticsSection, setShowAnalyticsSection,
    showPendingBookingsSection, setShowPendingBookingsSection,
    showAllBookingsSection, setShowAllBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection
  } = uiState;
  const { collapseIcon, expandIcon } = icons;


  const { bookingsOverTimeData, labPopularityData } = useMemo(() => {
    let bookingsOverTimeData = null;
    if (analyticsData?.bookingsOverTime) {
      bookingsOverTimeData = {
        labels: analyticsData.bookingsOverTime.labels,
        datasets: analyticsData.bookingsOverTime.datasets.map(dataset => {
          if (dataset.label.toLowerCase().includes('aprovados')) {
            return { ...dataset, borderColor: 'rgb(39, 174, 96)', backgroundColor: 'rgba(39, 174, 96, 0.5)', fill: true, tension: 0.3, };
          }
          if (dataset.label.toLowerCase().includes('pendentes')) {
            return { ...dataset, borderColor: 'rgb(242, 153, 74)', backgroundColor: 'rgba(242, 153, 74, 0.5)', fill: true, tension: 0.3, };
          }
          return { ...dataset, borderColor: 'rgb(155, 81, 224)', backgroundColor: 'rgba(155, 81, 224, 0.5)', tension: 0.3, };
        }),
      };
    }

    let labPopularityData = null;
    if (analyticsData?.labPopularity) {
      const barColors = [ 'rgba(47, 128, 237, 0.7)', 'rgba(39, 174, 96, 0.7)', 'rgba(242, 153, 74, 0.7)', 'rgba(235, 87, 87, 0.7)', 'rgba(155, 81, 224, 0.7)', 'rgba(86, 204, 242, 0.7)', ];
      const borderColors = [ 'rgb(47, 128, 237)', 'rgb(39, 174, 96)', 'rgb(242, 153, 74)', 'rgb(235, 87, 87)', 'rgb(155, 81, 224)', 'rgb(86, 204, 242)', ];
      labPopularityData = {
        labels: analyticsData.labPopularity.labels,
        datasets: analyticsData.labPopularity.datasets.map(dataset => ({ ...dataset, backgroundColor: barColors, borderColor: borderColors, borderWidth: 1, })),
      };
    }
    return { bookingsOverTimeData, labPopularityData };
  }, [analyticsData]);

  // ***** INÍCIO DA CORREÇÃO *****
  // Removemos 'getComputedStyle' e usamos o 'theme' prop diretamente.
  const chartColors = useMemo(() => {
    if (theme === 'dark') {
      return {
        textColor: '#E5E7EB', // Cor do texto no modo escuro (de index.css)
        gridColor: '#374151', // Cor da grade no modo escuro (de index.css)
      };
    }
    
    // Padrão para o modo claro
    return {
      textColor: '#1F2933', // Cor do texto no modo claro (de index.css)
      gridColor: 'rgba(0, 0, 0, 0.05)', // Cor da grade no modo claro (de index.css)
    };
  }, [theme]); // Depende apenas do 'theme' prop
  // ***** FIM DA CORREÇÃO *****


  return (
    <>
      {stats && ( <div className={commonStyles.cardContainer}> <div className={commonStyles.card}> <h3>Total de Usuários Ativos</h3> <p className={commonStyles.statNumber}>{stats.totalUsers}</p> </div> <div className={commonStyles.card}> <h3>Total de Laboratórios Ativos</h3> <p className={commonStyles.statNumber}>{stats.totalLaboratories}</p> </div> <div className={commonStyles.card}> <h3>Total de Periféricos Ativos</h3> <p className={commonStyles.statNumber}>{stats.totalPeripherals}</p> </div> <div className={commonStyles.card}> <h3>Total de Agendamentos</h3> <p className={commonStyles.statNumber}>{stats.totalBookings}</p> </div> </div> )}
      <div id="analise" className={commonStyles.section} ref={el => sectionRefs.current['analise'] = el}> 
        <h3 className={commonStyles.sectionTitle}> 
          Área Analítica 
          <button onClick={() => setShowAnalyticsSection(!showAnalyticsSection)} className={commonStyles.toggleSectionButton} > 
            <img 
              src={showAnalyticsSection ? collapseIcon : expandIcon} 
              alt={showAnalyticsSection ? 'Minimizar' : 'Expandir'} 
              className={`${commonStyles.toggleIcon} theme-icon-invert`}
            /> 
          </button> 
        </h3> 
        {showAnalyticsSection && ( 
          <div style={{ paddingTop: '1rem' }}> 
            {analyticsError ? ( <p className={commonStyles.errorMessage}>{analyticsError}</p> ) : analyticsData && bookingsOverTimeData && labPopularityData ? ( 
              <div className={styles.chartsContainer}> 
                <div className={styles.chartWrapper}> 
                  <h4 className={commonStyles.subSectionTitle}>Agendamentos nos Últimos 7 Dias</h4> 
                  <Line 
                    options={{ 
                      responsive: true, 
                      plugins: { 
                        legend: { position: 'top', labels: { color: chartColors.textColor } }, 
                        title: { display: true, text: 'Tendência de Agendamentos', color: chartColors.textColor }, 
                      }, 
                      scales: { 
                        y: { beginAtZero: true, grid: { color: chartColors.gridColor }, ticks: { color: chartColors.textColor } }, 
                        x: { grid: { display: false, }, ticks: { color: chartColors.textColor } } 
                      } 
                    }} 
                    data={bookingsOverTimeData} 
                  /> 
                </div> 
                <div className={styles.chartWrapper}> 
                  <h4 className={commonStyles.subSectionTitle}>Popularidade dos Laboratórios (Últimos 30 dias)</h4> 
                  <Bar 
                    options={{ 
                      responsive: true, 
                      indexAxis: 'y', 
                      plugins: { 
                        legend: { display: false }, 
                        title: { display: true, text: 'Nº de Agendamentos por Laboratório', color: chartColors.textColor }, 
                      }, 
                      scales: { 
                        x: { beginAtZero: true, grid: { color: chartColors.gridColor }, ticks: { color: chartColors.textColor } }, 
                        y: { grid: { display: false, }, ticks: { color: chartColors.textColor } } 
                      } 
                    }} 
                    data={labPopularityData} 
                  /> 
                </div> 
              </div> 
            ) : ( 
              <p className={commonStyles.noDataText}>Carregando dados analíticos...</p> 
            )} 
          </div> 
        )} 
      </div>

      <BookingList id="pendentes" title="Agendamentos Pendentes de Aprovação" bookings={pendingBookings} showActions={true} isExpanded={showPendingBookingsSection} onToggleExpand={() => setShowPendingBookingsSection(!showPendingBookingsSection)} sectionRef={el => sectionRefs.current['pendentes'] = el} user={user} handleApproveRejectBooking={handleApproveRejectBooking} handleDeleteBooking={handleDeleteBooking} collapseIcon={collapseIcon} expandIcon={expandIcon} />
      <BookingList id="todos-agendamentos" title="Todos os Agendamentos do Sistema" bookings={allBookings} showActions={true} forAdmin={true} isExpanded={showAllBookingsSection} onToggleExpand={() => setShowAllBookingsSection(!showAllBookingsSection)} sectionRef={el => sectionRefs.current['todos-agendamentos'] = el} user={user} handleApproveRejectBooking={handleApproveRejectBooking} handleDeleteBooking={handleDeleteBooking} collapseIcon={collapseIcon} expandIcon={expandIcon} />
      <BookingList id="proximos-agendamentos" title="Próximos Agendamentos no Sistema" bookings={upcomingBookings} isExpanded={showUpcomingBookingsSection} onToggleExpand={() => setShowUpcomingBookingsSection(!showUpcomingBookingsSection)} sectionRef={el => sectionRefs.current['proximos-agendamentos'] = el} user={user} collapseIcon={collapseIcon} expandIcon={expandIcon} />

      <div id="gerenciamento" className={commonStyles.section} ref={el => sectionRefs.current['gerenciamento'] = el}>
          <h3 className={commonStyles.sectionTitle}>
              Gerenciamento de Laboratórios e Periféricos
          </h3>
          <div className={commonStyles.buttonGroup}>
            <button
              className={commonStyles.simpleActionButton}
              onClick={() => {
                setShowManageLabs(!showManageLabs);
                setShowManagePeripherals(false); 
                setShowLabForm(false);
                setCurrentLaboratory(null);
                setCurrentPeripheral(null);
                setShowPeripheralForm(false);
              }}
            >
              {showManageLabs ? 'Ocultar Gerenciamento de Labs' : 'Gerenciar Laboratórios'}
            </button>
            <button
              className={commonStyles.simpleActionButton}
              style={{marginLeft: '1rem'}}
              onClick={() => {
                setShowManagePeripherals(!showManagePeripherals);
                setShowManageLabs(false); 
                setShowLabForm(false);
                setCurrentLaboratory(null); 
                setCurrentPeripheral(null);
                setShowPeripheralForm(false);
              }}
            >
              {showManagePeripherals ? 'Ocultar Gerenciamento de Periféricos' : 'Gerenciar Periféricos'}
            </button>
          </div>

          {showManageLabs && (
            <div className={styles.managementSection}>
              <h4 className={commonStyles.subSectionTitle}>Laboratórios Cadastrados</h4>
              <button onClick={() => {setShowLabForm(true); setCurrentLaboratory(null);}} className={commonStyles.createButton}>
                + Criar Novo Laboratório
              </button>

              {showLabForm && (
                <LaboratoryForm
                  lab={currentLaboratory}
                  onSave={handleCreateOrUpdateLab}
                  onCancel={() => setShowLabForm(false)}
                  commonStyles={commonStyles}
                />
              )}

              <ul className={commonStyles.list}>
                {allLaboratories.length > 0 ? (
                  allLaboratories.map((lab) => (
                    <li key={lab.id} className={commonStyles.listItem}>
                      <strong>{lab.name}</strong> (ID: {lab.id})<br />
                      Descrição: {lab.description}<br />
                      Capacidade: {lab.capacity}<br />
                      Localização: {lab.location}<br />
                      Status: {lab.active ? <span style={{color: 'var(--success-color)'}}>Ativo</span> : <span style={{color: 'var(--error-color)'}}>Inativo</span>}
                      <div className={commonStyles.buttonGroup} style={{justifyContent: 'flex-end', marginTop: '0.8rem'}}>
                        <button onClick={() => {setShowLabForm(true); setCurrentLaboratory(lab);}} className={commonStyles.editButton}>Editar</button>
                        <button onClick={() => handleDeleteLab(lab.id)} className={commonStyles.deleteButton}>Desativar</button>
                        <button onClick={() => handleViewPeripherals(lab)} className={commonStyles.viewPeripheralsButton}>Ver Periféricos</button>
                      </div>
                    </li>
                  ))
                ) : (
                  <EmptyState message="Nenhum laboratório cadastrado." />
                )}
              </ul>
            </div>
          )}

          {showManagePeripherals && (
            <div className={styles.managementSection}>
              {currentLaboratory ? (
                <>
                  <h4 className={commonStyles.subSectionTitle}>Periféricos do Laboratório: {currentLaboratory.name} (ID: {currentLaboratory.id})</h4>
                  <button onClick={() => {setShowPeripheralForm(true); setCurrentPeripheral(null);}} className={commonStyles.createButton}>
                    + Adicionar Novo Periférico a {currentLaboratory.name}
                  </button>
                  <button onClick={() => {setShowManagePeripherals(false); setCurrentLaboratory(null);}} className={commonStyles.backButton}>
                    ← Voltar
                  </button>

                  {showPeripheralForm && (
                    <PeripheralForm
                      peripheral={currentPeripheral}
                      onSave={handleCreateOrUpdatePeripheral}
                      onCancel={() => setShowPeripheralForm(false)}
                      commonStyles={commonStyles}
                    />
                  )}
                  
                  {isPeripheralsLoading ? (
                    <p className={commonStyles.noDataText}>Carregando periféricos...</p>
                  ) : (
                    <ul className={commonStyles.list}>
                      {peripheralsOfCurrentLab.length > 0 ? (
                        peripheralsOfCurrentLab.map((peripheral) => (
                          <li key={peripheral.id} className={commonStyles.listItem}>
                            <strong>{peripheral.name}</strong> (ID: {peripheral.id})<br />
                            Descrição: {peripheral.description}<br />
                            Quantidade: {peripheral.quantity}<br />
                            Status: {peripheral.active ? <span style={{color: 'var(--success-color)'}}>Ativo</span> : <span style={{color: 'var(--error-color)'}}>Inativo</span>}
                            <div className={commonStyles.buttonGroup} style={{justifyContent: 'flex-end', marginTop: '0.8rem'}}>
                              <button onClick={() => {setShowPeripheralForm(true); setCurrentPeripheral(peripheral);}} className={commonStyles.editButton}>Editar</button>
                              <button onClick={() => handleDeletePeripheral(peripheral.id)} className={commonStyles.deleteButton}>Desativar</button>
                            </div>
                          </li>
                        ))
                      ) : (
                        <EmptyState message="Nenhum periférico cadastrado para este laboratório." />
                      )}
                    </ul>
                  )}
                </>
              ) : (
                <p className={commonStyles.noDataText}>Selecione um laboratório para gerenciar seus periféricos, ou volte e gerencie laboratórios primeiro.</p>
              )}
            </div>
          )}
        </div>
    </>
  );
};

export default AdminDashboard;