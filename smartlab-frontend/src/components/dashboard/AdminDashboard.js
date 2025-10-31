// smartlab-frontend/src/components/dashboard/AdminDashboard.js
import React, { useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import BookingList from '../ui/BookingList';
import LaboratoryForm from '../forms/LaboratoryForm';
import PeripheralForm from '../forms/PeripheralForm';
import EmptyState from '../ui/EmptyState'; // <- 1. IMPORTAR

const AdminDashboard = ({
  styles,
  icons,
  sectionRefs,
  user,
  dataProps,
  actionProps,
  adminProps,
  uiState,
  theme
}) => {

  // ... (desestruturação de props inalterada) ...
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


  // ... (lógica de gráficos e chartColors inalterada) ...
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
  const chartColors = useMemo(() => {
    const styles = getComputedStyle(document.body);
    return {
      textColor: styles.getPropertyValue('--chart-text-color').trim() || (theme === 'dark' ? '#E5E7EB' : '#1F2933'),
      gridColor: styles.getPropertyValue('--chart-grid-color').trim() || (theme === 'dark' ? '#374151' : 'rgba(0,0,0,0.05)'),
    };
  }, [theme]);


  return (
    <>
      {/* ... (Stats e Área Analítica inalterados) ... */}
      {stats && ( <div style={styles.cardContainer}> <div style={styles.card}> <h3>Total de Usuários Ativos</h3> <p style={styles.statNumber}>{stats.totalUsers}</p> </div> <div style={styles.card}> <h3>Total de Laboratórios Ativos</h3> <p style={styles.statNumber}>{stats.totalLaboratories}</p> </div> <div style={styles.card}> <h3>Total de Periféricos Ativos</h3> <p style={styles.statNumber}>{stats.totalPeripherals}</p> </div> <div style={styles.card}> <h3>Total de Agendamentos</h3> <p style={styles.statNumber}>{stats.totalBookings}</p> </div> </div> )}
      <div id="analise" style={styles.section} ref={el => sectionRefs.current['analise'] = el}> <h3 style={styles.sectionTitle}> Área Analítica <button onClick={() => setShowAnalyticsSection(!showAnalyticsSection)} style={styles.toggleSectionButton} > <img src={showAnalyticsSection ? collapseIcon : expandIcon} alt={showAnalyticsSection ? 'Minimizar' : 'Expandir'} style={styles.toggleIcon} className="theme-icon-invert" /> </button> </h3> {showAnalyticsSection && ( <div style={{ paddingTop: '1rem' }}> {analyticsError ? ( <p style={styles.errorMessage}>{analyticsError}</p> ) : analyticsData && bookingsOverTimeData && labPopularityData ? ( <div style={styles.chartsContainer}> <div style={styles.chartWrapper}> <h4 style={styles.subSectionTitle}>Agendamentos nos Últimos 7 Dias</h4> <Line options={{ responsive: true, plugins: { legend: { position: 'top', labels: { color: chartColors.textColor } }, title: { display: true, text: 'Tendência de Agendamentos', color: chartColors.textColor }, }, scales: { y: { beginAtZero: true, grid: { color: chartColors.gridColor }, ticks: { color: chartColors.textColor } }, x: { grid: { display: false, }, ticks: { color: chartColors.textColor } } } }} data={bookingsOverTimeData} /> </div> <div style={styles.chartWrapper}> <h4 style={styles.subSectionTitle}>Popularidade dos Laboratórios (Últimos 30 dias)</h4> <Bar options={{ responsive: true, indexAxis: 'y', plugins: { legend: { display: false }, title: { display: true, text: 'Nº de Agendamentos por Laboratório', color: chartColors.textColor }, }, scales: { x: { beginAtZero: true, grid: { color: chartColors.gridColor }, ticks: { color: chartColors.textColor } }, y: { grid: { display: false, }, ticks: { color: chartColors.textColor } } } }} data={labPopularityData} /> </div> </div> ) : ( <p style={styles.noDataText}>Carregando dados analíticos...</p> )} </div> )} </div>

      {/* ... (BookingLists inalterados) ... */}
      <BookingList id="pendentes" title="Agendamentos Pendentes de Aprovação" bookings={pendingBookings} showActions={true} isExpanded={showPendingBookingsSection} onToggleExpand={() => setShowPendingBookingsSection(!showPendingBookingsSection)} sectionRef={el => sectionRefs.current['pendentes'] = el} user={user} styles={styles} handleApproveRejectBooking={handleApproveRejectBooking} handleDeleteBooking={handleDeleteBooking} collapseIcon={collapseIcon} expandIcon={expandIcon} />
      <BookingList id="todos-agendamentos" title="Todos os Agendamentos do Sistema" bookings={allBookings} showActions={true} forAdmin={true} isExpanded={showAllBookingsSection} onToggleExpand={() => setShowAllBookingsSection(!showAllBookingsSection)} sectionRef={el => sectionRefs.current['todos-agendamentos'] = el} user={user} styles={styles} handleApproveRejectBooking={handleApproveRejectBooking} handleDeleteBooking={handleDeleteBooking} collapseIcon={collapseIcon} expandIcon={expandIcon} />
      <BookingList id="proximos-agendamentos" title="Próximos Agendamentos no Sistema" bookings={upcomingBookings} isExpanded={showUpcomingBookingsSection} onToggleExpand={() => setShowUpcomingBookingsSection(!showUpcomingBookingsSection)} sectionRef={el => sectionRefs.current['proximos-agendamentos'] = el} user={user} styles={styles} collapseIcon={collapseIcon} expandIcon={expandIcon} />

      {/* Seção de Gerenciamento */}
      <div id="gerenciamento" style={styles.section} ref={el => sectionRefs.current['gerenciamento'] = el}>
          <h3 style={styles.sectionTitle}>
              Gerenciamento de Laboratórios e Periféricos
          </h3>
          <div style={styles.buttonGroup}>
            <button
              style={styles.simpleActionButton}
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
              style={{...styles.simpleActionButton, marginLeft: '1rem'}}
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
            <div style={styles.managementSection}>
              <h4 style={styles.subSectionTitle}>Laboratórios Cadastrados</h4>
              <button onClick={() => {setShowLabForm(true); setCurrentLaboratory(null);}} style={styles.createButton}>
                + Criar Novo Laboratório
              </button>

              {showLabForm && (
                <LaboratoryForm
                  lab={currentLaboratory}
                  onSave={handleCreateOrUpdateLab}
                  onCancel={() => setShowLabForm(false)}
                  styles={styles}
                />
              )}

              <ul style={styles.list}>
                {allLaboratories.length > 0 ? (
                  allLaboratories.map((lab) => (
                    <li key={lab.id} style={styles.listItem}>
                      <strong>{lab.name}</strong> (ID: {lab.id})<br />
                      Descrição: {lab.description}<br />
                      Capacidade: {lab.capacity}<br />
                      Localização: {lab.location}<br />
                      Status: {lab.active ? <span style={{color: 'var(--success-color)'}}>Ativo</span> : <span style={{color: 'var(--error-color)'}}>Inativo</span>}
                      <div style={styles.actionButtons}>
                        <button onClick={() => {setShowLabForm(true); setCurrentLaboratory(lab);}} style={styles.editButton}>Editar</button>
                        <button onClick={() => handleDeleteLab(lab.id)} style={styles.deleteButton}>Desativar</button>
                        <button onClick={() => handleViewPeripherals(lab)} style={styles.viewPeripheralsButton}>Ver Periféricos</button>
                      </div>
                    </li>
                  ))
                ) : (
                  // 2. SUBSTITUIR O <p> PELO <EmptyState>
                  <EmptyState message="Nenhum laboratório cadastrado." styles={styles} />
                )}
              </ul>
            </div>
          )}

          {showManagePeripherals && (
            <div style={styles.managementSection}>
              {currentLaboratory ? (
                <>
                  <h4 style={styles.subSectionTitle}>Periféricos do Laboratório: {currentLaboratory.name} (ID: {currentLaboratory.id})</h4>
                  <button onClick={() => {setShowPeripheralForm(true); setCurrentPeripheral(null);}} style={styles.createButton}>
                    + Adicionar Novo Periférico a {currentLaboratory.name}
                  </button>
                  <button onClick={() => {setShowManagePeripherals(false); setCurrentLaboratory(null);}} style={styles.backButton}>
                    ← Voltar para Gerenciar Labs
                  </button>

                  {showPeripheralForm && (
                    <PeripheralForm
                      peripheral={currentPeripheral}
                      onSave={handleCreateOrUpdatePeripheral}
                      onCancel={() => setShowPeripheralForm(false)}
                      styles={styles}
                    />
                  )}
                  
                  {isPeripheralsLoading ? (
                    <p style={styles.noDataText}>Carregando periféricos...</p>
                  ) : (
                    <ul style={styles.list}>
                      {peripheralsOfCurrentLab.length > 0 ? (
                        peripheralsOfCurrentLab.map((peripheral) => (
                          <li key={peripheral.id} style={styles.listItem}>
                            <strong>{peripheral.name}</strong> (ID: {peripheral.id})<br />
                            Descrição: {peripheral.description}<br />
                            Quantidade: {peripheral.quantity}<br />
                            Status: {peripheral.active ? <span style={{color: 'var(--success-color)'}}>Ativo</span> : <span style={{color: 'var(--error-color)'}}>Inativo</span>}
                            <div style={styles.actionButtons}>
                              <button onClick={() => {setShowPeripheralForm(true); setCurrentPeripheral(peripheral);}} style={styles.editButton}>Editar</button>
                              <button onClick={() => handleDeletePeripheral(peripheral.id)} style={styles.deleteButton}>Desativar</button>
                            </div>
                          </li>
                        ))
                      ) : (
                        // 3. SUBSTITUIR O <p> PELO <EmptyState>
                        <EmptyState message="Nenhum periférico cadastrado para este laboratório." styles={styles} />
                      )}
                    </ul>
                  )}
                </>
              ) : (
                <p style={styles.noDataText}>Selecione um laboratório para gerenciar seus periféricos, ou volte e gerencie laboratórios primeiro.</p>
              )}
            </div>
          )}
        </div>
    </>
  );
};

export default AdminDashboard;