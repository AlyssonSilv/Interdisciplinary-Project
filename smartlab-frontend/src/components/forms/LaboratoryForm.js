// smartlab-frontend/src/components/forms/LaboratoryForm.js
import React, { useState } from 'react';

const LaboratoryForm = ({ lab, onSave, onCancel, styles }) => {
    const [name, setName] = useState(lab?.name || '');
    const [description, setDescription] = useState(lab?.description || '');
    const [capacity, setCapacity] = useState(lab?.capacity || '');
    const [location, setLocation] = useState(lab?.location || '');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ id: lab?.id, name, description, capacity: parseInt(capacity, 10), location });
    };

    return (
      <div style={styles.formContainer}>
        <h4 style={styles.subSectionTitle}>{lab ? 'Editar Laboratório' : 'Criar Novo Laboratório'}</h4>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Descrição:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...styles.input, height: '60px' }} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Capacidade:</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required min="1" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Localização:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>Salvar</button>
            <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    );
};

export default LaboratoryForm;