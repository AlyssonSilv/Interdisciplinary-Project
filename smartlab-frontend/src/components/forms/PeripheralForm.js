// smartlab-frontend/src/components/forms/PeripheralForm.js
import React, { useState } from 'react';

const PeripheralForm = ({ peripheral, onSave, onCancel, styles }) => {
    const [name, setName] = useState(peripheral?.name || '');
    const [description, setDescription] = useState(peripheral?.description || '');
    const [quantity, setQuantity] = useState(peripheral?.quantity || '');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ id: peripheral?.id, name, description, quantity: parseInt(quantity, 10) });
    };

    return (
      <div style={styles.formContainer}>
        <h4 style={styles.subSectionTitle}>{peripheral ? 'Editar Periférico' : 'Adicionar Novo Periférico'}</h4>
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
            <label style={styles.label}>Quantidade:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" style={styles.input} />
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>Salvar</button>
            <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    );
};

export default PeripheralForm;