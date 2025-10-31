// smartlab-frontend/src/components/ui/BookingList.js
import React from 'react';
import EmptyState from './EmptyState'; 

const BookingList = ({
  title,
  bookings,
  showActions = false,
  forAdmin = false,
  id = null,
  isExpanded,
  onToggleExpand, 
  sectionRef, 
  user, // <-- O 'user' (logado) tem o user.id
  styles,
  handleApproveRejectBooking,
  handleCancelBooking,
  handleDeleteBooking,
  collapseIcon,
  expandIcon
}) => {
  return (
    <div id={id} style={styles.section} ref={sectionRef}>
      <h3 style={styles.sectionTitle}>
        {title}
        <button
          onClick={onToggleExpand}
          style={styles.toggleSectionButton}
        >
          <img 
            src={isExpanded ? collapseIcon : expandIcon} 
            alt={isExpanded ? 'Minimizar' : 'Expandir'} 
            style={styles.toggleIcon}
            className="theme-icon-invert"
          />
        </button>
      </h3>
      
      {isExpanded && (
        <div style={{ paddingTop: '1rem' }}>
          {Array.isArray(bookings) && bookings.length > 0 ? (
            <ul style={styles.list}>
              {bookings.map((booking) => ( // <-- O 'booking' (da lista) tem o booking.user.id
                <li key={booking.id} style={styles.listItem}>
                    {(user.role === 'PROFESSOR' || user.role === 'ADMIN') && !forAdmin && (
                    <>Usuário: {booking.user?.name} (RA: {booking.user?.ra}) <br /></>
                  )}
                  {forAdmin && (
                    <>Usuário: {booking.user?.name} (RA: {booking.user?.ra}) <br /></>
                  )}
                  Laboratório: {booking.laboratory?.name || 'N/A'} <br />
                  Período: {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()} <br />
                  Status: <span style={styles.bookingStatus[booking.status]}>{booking.status}</span> <br />
                  Propósito: {booking.purpose}
                  {booking.adminNotes && <p style={styles.adminNotes}>Obs. Admin: {booking.adminNotes}</p>}

                  {showActions && (
                    <div style={styles.actionButtons}>

                      {/* *** AQUI ESTÁ A CORREÇÃO DA LÓGICA ***
                        A condição agora verifica se:
                        1. O usuário é ADMIN, OU
                        2. O usuário é PROFESSOR E o ID de quem fez o booking É DIFERENTE do ID do professor logado
                        E o status é PENDENTE.
                      */}
                      {(
                        (user.role === 'ADMIN') || 
                        (user.role === 'PROFESSOR' && booking.user?.id !== user.id)
                      ) && booking.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApproveRejectBooking(booking.id, 'APPROVED')} style={styles.approveButton}>Aprovar</button>
                          <button onClick={() => {
                            const notes = prompt('Motivo da rejeição:');
                            if (notes !== null) handleApproveRejectBooking(booking.id, 'REJECTED', notes);
                          }} style={styles.rejectButton}>Rejeitar</button>
                        </>
                      )}

                      {/* A lógica de Cancelamento permanece a mesma (o usuário só pode cancelar o seu próprio) */}
                      {user.id === booking.user?.id && (booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                        <button onClick={() => handleCancelBooking(booking.id)} style={styles.cancelButton}>Cancelar</button>
                      )}
                      
                      {/* A lógica de Deleção permanece a mesma (só Admin) */}
                      {user.role === 'ADMIN' && (
                        <button onClick={() => handleDeleteBooking(booking.id)} style={styles.deleteButton}>Deletar</button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="Nenhum agendamento encontrado." styles={styles} />
          )}
        </div>
      )}
    </div>
  );
};

export default BookingList;