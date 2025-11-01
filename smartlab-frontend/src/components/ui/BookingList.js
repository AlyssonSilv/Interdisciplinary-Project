// smartlab-frontend/src/components/ui/BookingList.js
import React from 'react';
import EmptyState from './EmptyState'; 
import commonStyles from '../../styles/Common.module.css'; // 1. Importar estilos comuns
import styles from './BookingList.module.css'; // 2. Importar estilos locais

const BookingList = ({
  title,
  bookings,
  showActions = false,
  forAdmin = false,
  id = null,
  isExpanded,
  onToggleExpand, 
  sectionRef, 
  user,
  // 3. 'styles' foi renomeado para 'commonStyles' no Dashboard.js, mas este componente nem precisa mais dele
  // styles, (removido das props)
  handleApproveRejectBooking,
  handleCancelBooking,
  handleDeleteBooking,
  collapseIcon,
  expandIcon
}) => {

  // 4. Mapear status para as classes de estilo
  const statusStyles = {
    APPROVED: styles.statusApproved,
    PENDING: styles.statusPending,
    REJECTED: styles.statusRejected,
    CANCELLED: styles.statusCancelled,
    COMPLETED: styles.statusCompleted,
  };

  return (
    // 5. Usar 'className'
    <div id={id} className={commonStyles.section} ref={sectionRef}>
      <h3 className={commonStyles.sectionTitle}>
        {title}
        <button
          onClick={onToggleExpand}
          className={commonStyles.toggleSectionButton}
        >
          <img 
            src={isExpanded ? collapseIcon : expandIcon} 
            alt={isExpanded ? 'Minimizar' : 'Expandir'} 
            className={`${commonStyles.toggleIcon} theme-icon-invert`}
          />
        </button>
      </h3>
      
      {isExpanded && (
        <div style={{ paddingTop: '1rem' }}>
          {Array.isArray(bookings) && bookings.length > 0 ? (
            <ul className={commonStyles.list}>
              {bookings.map((booking) => (
                <li key={booking.id} className={styles.listItem}>
                    {(user.role === 'PROFESSOR' || user.role === 'ADMIN') && !forAdmin && (
                    <>Usuário: {booking.user?.name} (RA: {booking.user?.ra}) <br /></>
                  )}
                  {forAdmin && (
                    <>Usuário: {booking.user?.name} (RA: {booking.user?.ra}) <br /></>
                  )}
                  Laboratório: {booking.laboratory?.name || 'N/A'} <br />
                  Período: {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()} <br />
                  Status: <span className={statusStyles[booking.status]}>{booking.status}</span> <br />
                  Propósito: {booking.purpose}
                  {booking.adminNotes && <p className={styles.adminNotes}>Obs. Admin: {booking.adminNotes}</p>}

                  {showActions && (
                    <div className={styles.actionButtons}>
                      {(
                        (user.role === 'ADMIN') || 
                        (user.role === 'PROFESSOR' && booking.user?.id !== user.id)
                      ) && booking.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApproveRejectBooking(booking.id, 'APPROVED')} className={commonStyles.approveButton}>Aprovar</button>
                          <button onClick={() => {
                            const notes = prompt('Motivo da rejeição:');
                            if (notes !== null) handleApproveRejectBooking(booking.id, 'REJECTED', notes);
                          }} className={commonStyles.rejectButton}>Rejeitar</button>
                        </>
                      )}
                      
                      {user.id === booking.user?.id && (booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                        <button onClick={() => handleCancelBooking(booking.id)} className={commonStyles.cancelButton}>Cancelar</button>
                      )}
                      
                      {user.role === 'ADMIN' && (
                        <button onClick={() => handleDeleteBooking(booking.id)} className={commonStyles.deleteButton}>Deletar</button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            // 6. Passar 'commonStyles' para o EmptyState
            <EmptyState message="Nenhum agendamento encontrado." commonStyles={commonStyles} />
          )}
        </div>
      )}
    </div>
  );
};

export default BookingList;