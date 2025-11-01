// smartlab-frontend/src/components/forms/NewBookingForm.js
import React from 'react';
import commonStyles from '../../styles/Common.module.css'; // 1. Importar comuns
import styles from './NewBookingForm.module.css'; // 2. Importar locais

const NewBookingForm = ({
  user,
  commonStyles, // 3. Recebe commonStyles
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
    isRecurring,
    setIsRecurring,
    numWeeks,
    setNumWeeks
  } = formProps;

  const { showNewBookingSection, setShowNewBookingSection } = uiStateProps;
  const { collapseIcon, expandIcon } = icons;

  return (
    // 4. Usar 'className'
    <div id="novo-agendamento" className={commonStyles.section} ref={el => sectionRefs.current['novo-agendamento'] = el}>
      <h3 className={commonStyles.sectionTitle}>
        Novo Agendamento
        <button
          onClick={() => setShowNewBookingSection(!showNewBookingSection)}
          className={commonStyles.toggleSectionButton}
        >
           <img 
              src={showNewBookingSection ? collapseIcon : expandIcon} 
              alt={showNewBookingSection ? 'Minimizar' : 'Expandir'} 
              className={`${commonStyles.toggleIcon} theme-icon-invert`}
            />
        </button>
      </h3>
      
      {showNewBookingSection && (
        <div style={{ paddingTop: '1rem' }}>
          <>
            <button onClick={() => setShowBookingForm(!showBookingForm)} className={commonStyles.toggleFormButton}>
              {showBookingForm ? 'Ocultar Formulário' : 'Fazer um Novo Agendamento'}
            </button>

            {showBookingForm && (
              <form onSubmit={handleCreateBooking} className={commonStyles.form}>
                <div className={commonStyles.formGroup}>
                  <label htmlFor="lab" className={commonStyles.label}>Laboratório:</label>
                  <select id="lab" value={newBookingLabId} onChange={(e) => setNewBookingLabId(e.target.value)} required className={commonStyles.input} >
                    <option value="" disabled>Selecione um laboratório</option>
                    {Array.isArray(availableLaboratories) && availableLaboratories.map((lab) => (
                      <option key={lab.id} value={lab.id}> {lab.name} (Capacidade: {lab.capacity}, Local: {lab.location}) </option>
                    ))}
                  </select>
                </div>
                
                <div className={commonStyles.formGroup}>
                  <label htmlFor="bookingDate" className={commonStyles.label}>Data do Agendamento:</label>
                  <input type="date" id="bookingDate" value={newBookingDate} onChange={(e) => setNewBookingDate(e.target.value)} required className={commonStyles.input} min={new Date().toISOString().slice(0, 10)} />
                </div>

                {isSlotsLoading && (
                  <p className={commonStyles.noDataText}>Buscando horários disponíveis...</p>
                )}
                
                {!isSlotsLoading && newBookingLabId && newBookingDate && availableTimeSlots.length === 0 && !loading && (
                  <p className={commonStyles.warningMessage}>Nenhum horário disponível para esta data/laboratório.</p>
                )}
                
                <div className={commonStyles.formGroup}>
                  <label htmlFor="timeSlot" className={commonStyles.label}>Horário Disponível:</label>
                  <select
                    id="timeSlot"
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    required
                    className={commonStyles.input}
                    disabled={availableTimeSlots.length === 0 || isSlotsLoading}
                  >
                    <option value="">Selecione um horário</option>
                    {Array.isArray(availableTimeSlots) && availableTimeSlots.map((slot, index) => (
                      <option key={index} value={slot}> {slot} </option>
                    ))}
                  </select>
                </div>

                {newBookingLabId && isPeripheralsLoading && (
                   <p className={commonStyles.noDataText}>Buscando periféricos...</p>
                )}

                {newBookingLabId && !isPeripheralsLoading && availablePeripherals.length > 0 && (
                  <div className={commonStyles.section} style={{padding: '0.8rem'}}> {/* Estilo inline para padding menor */}
                    <h4 className={commonStyles.subSectionTitle}>Periféricos Desejados:</h4>
                    <div className={styles.peripheralsGrid}>
                      {availablePeripherals.map(peripheral => (
                        <div key={peripheral.id} className={styles.peripheralItem}>
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
                            className={styles.peripheralInput}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={commonStyles.formGroup}>
                  <label htmlFor="purpose" className={commonStyles.label}>Finalidade:</label>
                  <textarea id="purpose" value={newBookingPurpose} onChange={(e) => setNewBookingPurpose(e.target.value)} required className={commonStyles.textarea} style={{height: '80px'}} />
                </div>
                
                {(user.role === 'PROFESSOR' || user.role === 'ADMIN') && (
                  <div className={styles.recurringSection}>
                    <div className={commonStyles.formGroup} style={{marginBottom: isRecurring ? '1rem' : '0'}}>
                      <label className={styles.recurringCheckboxLabel}>
                        <input
                          type="checkbox"
                          checked={isRecurring}
                          onChange={(e) => setIsRecurring(e.target.checked)}
                          className={styles.recurringCheckbox}
                        />
                        Agendamento Recorrente (Semanal)
                      </label>
                    </div>
                    {isRecurring && (
                      <div className={commonStyles.formGroup} style={{marginBottom: 0}}>
                        <label htmlFor="numWeeks" className={commonStyles.label}>Repetir pelas próximas (Nº de semanas):</label>
                        <input
                          type="number"
                          id="numWeeks"
                          value={numWeeks}
                          onChange={(e) => setNumWeeks(parseInt(e.target.value, 10) || 1)}
                          min="1"
                          max="20"
                          className={commonStyles.input}
                        />
                      </div>
                    )}
                  </div>
                )}

                <button 
                  type="submit" 
                  className={commonStyles.submitButton}
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