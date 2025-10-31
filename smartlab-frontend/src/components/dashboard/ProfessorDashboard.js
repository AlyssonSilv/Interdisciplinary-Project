// smartlab-frontend/src/components/dashboard/ProfessorDashboard.js
import React, { useState } from 'react'; // <- 1. IMPORTAR useState
import BookingList from '../ui/BookingList';
import NewBookingForm from '../forms/NewBookingForm'; // <- 2. IMPORTAR O NOVO FORMULÁRIO

const ProfessorDashboard = ({
  styles,
  icons,
  sectionRefs,
  user,
  dataProps,
  formProps, // <- 3. RECEBER PROPS DO FORMULÁRIO
  actionProps,
  uiState,
  loading // <- 3. RECEBER PROPS DO FORMULÁRIO
}) => {
  
  const { stats, pendingBookings, myBookings, upcomingBookings } = dataProps;
  const { handleApproveRejectBooking, handleCancelBooking } = actionProps;
  const {
    showPendingBookingsSection, setShowPendingBookingsSection,
    showMyBookingsSection, setShowMyBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection
  } = uiState;
  const { collapseIcon, expandIcon } = icons;

  // 4. ADICIONAR ESTADO LOCAL PARA O FORMULÁRIO
  const [showNewBookingSection, setShowNewBookingSection] = useState(true);

  return (
    <>
      {stats && (
        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h3>Total de Agendamentos</h3>
            <p style={styles.statNumber}>{stats.totalBookings}</p>
          </div>
          <div style={styles.card}>
            <h3>Agendamentos Pendentes</h3>
            <p style={styles.statNumber}>{stats.pendingBookings}</p>
          </div>
          <div style={styles.card}>
            <h3>Agendamentos Aprovados</h3>
            <p style={styles.statNumber}>{stats.approvedBookings}</p>
          </div>
        </div>
      )}

      {/* 5. ADICIONAR O COMPONENTE DE FORMULÁRIO */}
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
        id="pendentes"
        title="Agendamentos Pendentes de Aprovação"
        bookings={pendingBookings}
        showActions={true}
        isExpanded={showPendingBookingsSection}
        onToggleExpand={() => setShowPendingBookingsSection(!showPendingBookingsSection)}
        sectionRef={el => sectionRefs.current['pendentes'] = el}
        user={user}
        styles={styles}
        handleApproveRejectBooking={handleApproveRejectBooking}
        collapseIcon={collapseIcon}
        expandIcon={expandIcon}
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

export default ProfessorDashboard;