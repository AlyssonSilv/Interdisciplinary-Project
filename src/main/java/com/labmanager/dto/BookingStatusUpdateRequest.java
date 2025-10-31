package com.labmanager.dto;

import com.labmanager.model.BookingStatus; // Importa o enum que define os status
import jakarta.validation.constraints.NotNull; // Garante que o status não seja nulo
import jakarta.validation.constraints.Size;   // Limita o tamanho das notas

/**
 * DTO para requisição de atualização de status de agendamento
 * Usado pelo administrador para aprovar/rejeitar agendamentos
 */
public class BookingStatusUpdateRequest {

    @NotNull // O status é um campo obrigatório
    private BookingStatus status;

    @Size(max = 1000) // Limita o tamanho das notas do administrador (motivo da rejeição, etc.)
    private String adminNotes; // Mapeia para `rejectionReason` no frontend

    // Construtores
    public BookingStatusUpdateRequest() {}

    public BookingStatusUpdateRequest(BookingStatus status, String adminNotes) {
        this.status = status;
        this.adminNotes = adminNotes;
    }

    // Getters e Setters
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}