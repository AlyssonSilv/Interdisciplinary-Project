// smartlab-frontend/src/components/forms/PeripheralForm.js
import React, { useState } from 'react';

// 1. Recebe 'commonStyles'
const PeripheralForm = ({ peripheral, onSave, onCancel, commonStyles }) => {
    const [name, setName] = useState(peripheral?.name || '');
    const [description, setDescription] = useState(peripheral?.description || '');
    const [quantity, setQuantity] = useState(peripheral?.quantity || '');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ id: peripheral?.id, name, description, quantity: parseInt(quantity, 10) });
    };

    return (
      // 2. Usa 'className'
      <div className={commonStyles.formContainer}>
        <h4 className={commonStyles.subSectionTitle}>{peripheral ? 'Editar Periférico' : 'Adicionar Novo Periférico'}</h4>
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
            <label className={commonStyles.label}>Quantidade:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" className={commonStyles.input} />
          </div>
          <div className={commonStyles.buttonGroup}>
            <button type="submit" className={commonStyles.submitButton}>Salvar</button>
            <button type="button" onClick={onCancel} className={commonStyles.cancelButton}>Cancelar</button>
          </div>
        </form>
      </div>
    );
};

export default PeripheralForm;