// smartlab-frontend/src/components/forms/NewBookingForm.js
import React from 'react';

// Este componente recebe todas as props de formulário
const NewBookingForm = ({
  user,
  styles,
  icons,
  sectionRefs,
  dataProps,
  formProps,
  uiStateProps,
  loading
}) => {

  const { availableLaboratories } = dataProps;
  const {
    newBookingLabId, setNewBookingLabId,
    newBookingDate, setNewBookingDate,
    availableTimeSlots,
    selectedTimeSlot, setSelectedTimeSlot,
    newBookingPurpose, setNewBookingPurpose,
    showBookingForm, setShowBookingForm,
    availablePeripherals,
    selectedPeripherals,
    handlePeripheralQuantityChange,
    handleCreateBooking,
    isSlotsLoading,
    isPeripheralsLoading,
    isSubmitting,
    isRecurring, // <- Prop de recorrência
    setIsRecurring, // <- Prop de recorrência
    numWeeks, // <- Prop de recorrência
    setNumWeeks // <- Prop de recorrência
  } = formProps;

  const { showNewBookingSection, setShowNewBookingSection } = uiStateProps;
  const { collapseIcon, expandIcon } = icons;

  return (
    <div id="novo-agendamento" style={styles.section} ref={el => sectionRefs.current['novo-agendamento'] = el}>
      <h3 style={styles.sectionTitle}>
        Novo Agendamento
        <button
          onClick={() => setShowNewBookingSection(!showNewBookingSection)}
          style={styles.toggleSectionButton}
        >
           <img 
              src={showNewBookingSection ? collapseIcon : expandIcon} 
              alt={showNewBookingSection ? 'Minimizar' : 'Expandir'} 
              style={styles.toggleIcon}
              className="theme-icon-invert"
            />
        </button>
      </h3>
      
      {showNewBookingSection && (
        <div style={{ paddingTop: '1rem' }}>
          <>
            <button onClick={() => setShowBookingForm(!showBookingForm)} style={styles.toggleFormButton}>
              {showBookingForm ? 'Ocultar Formulário' : 'Fazer um Novo Agendamento'}
            </button>

            {showBookingForm && (
              <form onSubmit={handleCreateBooking} style={styles.form}>
                <div style={styles.formGroup}>
                  <label htmlFor="lab" style={styles.label}>Laboratório:</label>
                  <select id="lab" value={newBookingLabId} onChange={(e) => setNewBookingLabId(e.target.value)} required style={styles.input} >
                    <option value="" disabled>Selecione um laboratório</option>
                    {Array.isArray(availableLaboratories) && availableLaboratories.map((lab) => (
                      <option key={lab.id} value={lab.id}> {lab.name} (Capacidade: {lab.capacity}, Local: {lab.location}) </option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="bookingDate" style={styles.label}>Data do Agendamento:</label>
                  <input type="date" id="bookingDate" value={newBookingDate} onChange={(e) => setNewBookingDate(e.target.value)} required style={styles.input} min={new Date().toISOString().slice(0, 10)} />
                </div>

                {isSlotsLoading && (
                  <p style={styles.noDataText}>Buscando horários disponíveis...</p>
                )}
                
                {!isSlotsLoading && newBookingLabId && newBookingDate && availableTimeSlots.length === 0 && !loading && (
                  <p style={styles.warningMessage}>Nenhum horário disponível para esta data/laboratório.</p>
                )}
                
                <div style={styles.formGroup}>
                  <label htmlFor="timeSlot" style={styles.label}>Horário Disponível:</label>
                  <select
                    id="timeSlot"
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    required
                    style={styles.input}
                    disabled={availableTimeSlots.length === 0 || isSlotsLoading}
                  >
                    <option value="">Selecione um horário</option>
                    {Array.isArray(availableTimeSlots) && availableTimeSlots.map((slot, index) => (
                      <option key={index} value={slot}> {slot} </option>
                    ))}
                  </select>
                </div>

                {newBookingLabId && isPeripheralsLoading && (
                   <p style={styles.noDataText}>Buscando periféricos...</p>
                )}

                {newBookingLabId && !isPeripheralsLoading && availablePeripherals.length > 0 && (
                  <div style={styles.section}>
                    <h4 style={styles.subSectionTitle}>Periféricos Desejados:</h4>
                    <div style={styles.peripheralsGrid}>
                      {availablePeripherals.map(peripheral => (
                        <div key={peripheral.id} style={styles.peripheralItem}>
                          <label htmlFor={`peripheral-${peripheral.id}`}>
                            {peripheral.name} (Disp: {peripheral.quantity})
                          </label>
                          <input
                            type="number"
                            id={`peripheral-${peripheral.id}`}
                            min="0"
                            max={peripheral.quantity}
                            value={selectedPeripherals[peripheral.id] || 0}
                            onChange={(e) => handlePeripheralQuantityChange(peripheral.id, e.target.value)}
                            style={styles.peripheralInput}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label htmlFor="purpose" style={styles.label}>Finalidade:</label>
                  <textarea id="purpose" value={newBookingPurpose} onChange={(e) => setNewBookingPurpose(e.target.value)} required style={{ ...styles.input, height: '80px' }} />
                </div>
                
                {/* --- INÍCIO DA FUNCIONALIDADE RECORRENTE --- */}
                {/* Só mostra para Professores e Admins */}
                {(user.role === 'PROFESSOR' || user.role === 'ADMIN') && (
                  <div style={{border: '1px dashed var(--form-container-border)', borderRadius: '8px', padding: '1rem', marginTop: '1rem', backgroundColor: 'var(--bg-color)'}}>
                    <div style={{...styles.formGroup, marginBottom: isRecurring ? '1rem' : '0', userSelect: 'none'}}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 500 }}>
                        <input
                          type="checkbox"
                          checked={isRecurring}
                          onChange={(e) => setIsRecurring(e.target.checked)}
                          style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        Agendamento Recorrente (Semanal)
                      </label>
                    </div>
                    {isRecurring && (
                      <div style={styles.formGroup}>
                        <label htmlFor="numWeeks" style={styles.label}>Repetir pelas próximas (Nº de semanas):</label>
                        <input
                          type="number"
                          id="numWeeks"
                          value={numWeeks}
                          onChange={(e) => setNumWeeks(parseInt(e.target.value, 10) || 1)}
                          min="1"
                          max="20" // Limite semestral
                          style={styles.input}
                        />
                      </div>
                    )}
                  </div>
                )}
                {/* --- FIM DA FUNCIONALIDADE RECORRENTE --- */}

                <button 
                  type="submit" 
                  style={styles.submitButton} 
                  disabled={!newBookingLabId || !newBookingDate || !selectedTimeSlot || isSubmitting}
                >
                  {isSubmitting ? 'Agendando...' : 'Agendar Laboratório'}
                </button>
              </form>
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default NewBookingForm;