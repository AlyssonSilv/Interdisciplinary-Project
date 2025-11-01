// smartlab-frontend/src/components/ui/EmptyState.js
import React from 'react';
import styles from './EmptyState.module.css'; // 1. Importar CSS Module

const EmptyState = ({ message, commonStyles }) => {
  // Pega a cor do texto silenciado do tema
  const mutedColor = getComputedStyle(document.body).getPropertyValue('--text-color-muted');

  return (
    // 2. Usar classes CSS
    <div className={styles.emptyStateContainer}>
      <span 
        className={styles.emojiIcon}
        role="img" 
        aria-label="Ícone de pasta vazia"
      >
        🗂️
      </span>
      
      {/* 3. Usa a classe de mensagem local e aplica a cor dinamicamente */}
      <p className={styles.message} style={{ color: mutedColor }}>
        {message || "Nenhum item encontrado."}
      </p>
    </div>
  );
};

export default EmptyState;