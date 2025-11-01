// smartlab-frontend/src/components/dashboard/ProfessorDashboard.js
import React, { useState } from 'react';
import BookingList from '../ui/BookingList';
import NewBookingForm from '../forms/NewBookingForm';

const ProfessorDashboard = ({
  commonStyles, // 1. Recebe 'commonStyles' em vez de 'styles'
  icons,
  sectionRefs,
  user,
  dataProps,
  formProps,
  actionProps,
  uiState,
  loading
}) => {
  
  const { stats, pendingBookings, myBookings, upcomingBookings } = dataProps;
  const { handleApproveRejectBooking, handleCancelBooking } = actionProps;
  const {
    showPendingBookingsSection, setShowPendingBookingsSection,
    showMyBookingsSection, setShowMyBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection
  } = uiState;
  const { collapseIcon, expandIcon } = icons;

  const [showNewBookingSection, setShowNewBookingSection] = useState(true);

  return (
    <>
      {stats && (
        // 2. Usar className
        <div className={commonStyles.cardContainer}>
          <div className={commonStyles.card}>
            <h3>Total de Agendamentos</h3>
            <p className={commonStyles.statNumber}>{stats.totalBookings}</p>
          </div>
          <div className={commonStyles.card}>
            <h3>Agendamentos Pendentes</h3>
            <p className={commonStyles.statNumber}>{stats.pendingBookings}</p>
          </div>
          <div className={commonStyles.card}>
            <h3>Agendamentos Aprovados</h3>
            <p className={commonStyles.statNumber}>{stats.approvedBookings}</p>
          </div>
        </div>
      )}

      {/* 3. Passar 'commonStyles' para os filhos */}
      <NewBookingForm
        user={user}
        commonStyles={commonStyles}
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
        collapseIcon={collapseIcon}
        expandIcon={expandIcon}
      />
    </>
  );
};

export default ProfessorDashboard;