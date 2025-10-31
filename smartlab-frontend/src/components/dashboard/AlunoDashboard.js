// smartlab-frontend/src/components/dashboard/AlunoDashboard.js
import React from 'react';
import BookingList from '../ui/BookingList';
import NewBookingForm from '../forms/NewBookingForm'; // <- 1. IMPORTAR O NOVO FORMULÁRIO

const AlunoDashboard = ({
  styles,
  icons,
  sectionRefs,
  user,
  dataProps,
  formProps,
  actionProps,
  uiState,
  loading
}) => {
  
  const { stats, myBookings, upcomingBookings } = dataProps;
  const { handleCancelBooking } = actionProps;
  const {
    showMyBookingsSection, setShowMyBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection,
    showNewBookingSection, setShowNewBookingSection // Pega o estado do Dashboard.js
  } = uiState;
  const { collapseIcon, expandIcon } = icons;

  return (
    <>
      {stats && (
        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h3>Agendamentos Aprovados</h3>
            <p style={styles.statNumber}>{stats.approvedBookings}</p>
          </div>
          <div style={styles.card}>
            <h3>Agendamentos Pendentes</h3>
            <p style={styles.statNumber}>{stats.pendingBookings}</p>
          </div>
          <div style={styles.card}>
            <h3>Total de Laboratórios</h3>
            <p style={styles.statNumber}>{stats.totalLaboratories}</p>
          </div>
        </div>
      )}

      {/* 2. SUBSTITUIR O BLOCO DO FORMULÁRIO ANTIGO */}
      <NewBookingForm
        user={user}
        styles={styles}
        icons={icons}
        sectionRefs={sectionRefs}
        dataProps={dataProps}
        formProps={formProps}
        uiStateProps={{ showNewBookingSection, setShowNewBookingSection }}
        loading={loading}
      />

      <BookingList
        id="meus-agendamentos"
        title="Meus Agendamentos"
        bookings={myBookings}
        showActions={true}
        isExpanded={showMyBookingsSection}
        onToggleExpand={() => setShowMyBookingsSection(!showMyBookingsSection)}
        sectionRef={el => sectionRefs.current['meus-agendamentos'] = el}
        user={user}
        styles={styles}
        handleCancelBooking={handleCancelBooking}
        collapseIcon={collapseIcon}
        expandIcon={expandIcon}
      />
      <BookingList
        id="proximos-agendamentos"
        title="Próximos Agendamentos no Sistema"
        bookings={upcomingBookings}
        isExpanded={showUpcomingBookingsSection}
        onToggleExpand={() => setShowUpcomingBookingsSection(!showUpcomingBookingsSection)}
        sectionRef={el => sectionRefs.current['proximos-agendamentos'] = el}
        user={user}
        styles={styles}
        collapseIcon={collapseIcon}
        expandIcon={expandIcon}
      />
    </>
  );
};

export default AlunoDashboard;