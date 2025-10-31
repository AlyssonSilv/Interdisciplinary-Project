package com.labmanager.model;

/**
 * Enum que define os possíveis status de um agendamento
 * Controla o fluxo de aprovação dos agendamentos
 */
public enum BookingStatus {
    PENDING,    // Aguardando aprovação
    APPROVED,   // Aprovado pelo administrador/professor
    REJECTED,   // Rejeitado
    CANCELLED,  // Cancelado pelo usuário
    COMPLETED   // Agendamento concluído
}
