// smartlab-frontend/src/components/forms/LaboratoryForm.js
import React, { useState } from 'react';

// 1. Recebe 'commonStyles'
const LaboratoryForm = ({ lab, onSave, onCancel, commonStyles }) => {
    const [name, setName] = useState(lab?.name || '');
    const [description, setDescription] = useState(lab?.description || '');
    const [capacity, setCapacity] = useState(lab?.capacity || '');
    const [location, setLocation] = useState(lab?.location || '');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ id: lab?.id, name, description, capacity: parseInt(capacity, 10), location });
    };

    return (
      // 2. Usa 'className'
      <div className={commonStyles.formContainer}>
        <h4 className={commonStyles.subSectionTitle}>{lab ? 'Editar Laboratório' : 'Criar Novo Laboratório'}</h4>
        <form onSubmit={handleSubmit} className={commonStyles.form}>
          <div className={commonStyles.formGroup}>
            <label className={commonStyles.label}>Nome:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={commonStyles.input} />
          </div>
          <div className={commonStyles.formGroup}>
            <label className={commonStyles.label}>Descrição:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={commonStyles.textarea} />
          </div>
          <div className={commonStyles.formGroup}>
            <label className={commonStyles.label}>Capacidade:</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required min="1" className={commonStyles.input} />
          </div>
          <div className={commonStyles.formGroup}>
            <label className={commonStyles.label}>Localização:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={commonStyles.input} />
          </div>
          <div className={commonStyles.buttonGroup}>
            <button type="submit" className={commonStyles.submitButton}>Salvar</button>
            <button type="button" onClick={onCancel} className={commonStyles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    );
};

export default LaboratoryForm;