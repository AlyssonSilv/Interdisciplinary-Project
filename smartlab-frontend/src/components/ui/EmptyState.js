// smartlab-frontend/src/components/ui/EmptyState.js
import React from 'react';

const EmptyState = ({ message, styles }) => {
  // Pega a cor do texto silenciado do tema
  const mutedColor = getComputedStyle(document.body).getPropertyValue('--text-color-muted');

  return (
    <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
      
      {/* Usar um emoji grande em vez da biblioteca externa */}
      <span 
        style={{ fontSize: '100px', lineHeight: '1', filter: 'grayscale(100%)' }} 
        role="img" 
        aria-label="Ícone de pasta vazia"
      >
        🗂️
      </span>

      <p style={{ ...styles.noDataText, fontSize: '1.1rem', marginTop: '1.5rem', color: mutedColor }}>
        {message || "Nenhum item encontrado."}
      </p>
    </div>
  );
};

export default EmptyState;