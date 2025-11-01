// smartlab-frontend/src/components/dashboard/AlunoDashboard.js
import React from 'react';
import BookingList from '../ui/BookingList';
import NewBookingForm from '../forms/NewBookingForm';

const AlunoDashboard = ({
  commonStyles, 
  icons,
  sectionRefs,
  user,
  dataProps,
  formProps,
  actionProps,
  uiState,
  loading
}) => {
  
  // 1. ADICIONE ESTA LINHA PARA CORRIGIR O ERRO
  const { collapseIcon, expandIcon } = icons;

  const { stats, myBookings, upcomingBookings } = dataProps;
  const { handleCancelBooking } = actionProps;
  const {
    showMyBookingsSection, setShowMyBookingsSection,
    showUpcomingBookingsSection, setShowUpcomingBookingsSection,
    showNewBookingSection, setShowNewBookingSection
  } = uiState;

  return (
    <>
      {stats && (
        <div className={commonStyles.cardContainer}>
          <div className={commonStyles.card}>
            <h3>Agendamentos Aprovados</h3>
            <p className={commonStyles.statNumber}>{stats.approvedBookings}</p>
          </div>
          <div className={commonStyles.card}>
            <h3>Agendamentos Pendentes</h3>
            <p className={commonStyles.statNumber}>{stats.pendingBookings}</p>
          </div>
          <div className={commonStyles.card}>
            <h3>Total de Laboratórios</h3>
            <p className={commonStyles.statNumber}>{stats.totalLaboratories}</p>
          </div>
        </div>
      )}

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
        id="meus-agendamentos"
        title="Meus Agendamentos"
        bookings={myBookings}
        showActions={true}
        isExpanded={showMyBookingsSection}
        onToggleExpand={() => setShowMyBookingsSection(!showMyBookingsSection)}
        sectionRef={el => sectionRefs.current['meus-agendamentos'] = el}
        user={user}
        handleCancelBooking={handleCancelBooking}
        collapseIcon={collapseIcon} // Agora 'collapseIcon' está definido
        expandIcon={expandIcon}     // Agora 'expandIcon' está definido
      />
      <BookingList
        id="proximos-agendamentos"
        title="Próximos Agendamentos no Sistema"
        bookings={upcomingBookings}
        isExpanded={showUpcomingBookingsSection}
        onToggleExpand={() => setShowUpcomingBookingsSection(!showUpcomingBookingsSection)}
        sectionRef={el => sectionRefs.current['proximos-agendamentos'] = el}
        user={user}
        collapseIcon={collapseIcon} // Agora 'collapseIcon' está definido
        expandIcon={expandIcon}     // Agora 'expandIcon' está definido
      />
    </>
  );
};

export default AlunoDashboard;