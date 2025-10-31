package com.labmanager.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para requisição de criação de agendamento
 * Contém todos os dados necessários para criar um novo agendamento
 */
public class BookingRequest {

    @NotNull
    private Long laboratoryId;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    @Size(max = 500)
    private String purpose;

    private List<PeripheralRequest> peripherals;

    // --- 1. CAMPOS ADICIONADOS PARA RECORRÊNCIA ---
    // Usamos 'Boolean' e 'Integer' (wrapper classes) em vez de 'boolean' e 'int'
    // para que eles possam ser nulos (null) se não forem enviados pelo frontend.
    private Boolean isRecurring;
    private Integer numWeeks;
    // --- FIM DA ADIÇÃO ---


    // Classe interna (inalterada)
    public static class PeripheralRequest {
        private Long peripheralId;
        private Integer quantity = 1;

        public PeripheralRequest() {}

        public PeripheralRequest(Long peripheralId, Integer quantity) {
            this.peripheralId = peripheralId;
            this.quantity = quantity;
        }

        public Long getPeripheralId() { return peripheralId; }
        public void setPeripheralId(Long peripheralId) { this.peripheralId = peripheralId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    // Construtores (inalterados)
    public BookingRequest() {}

    public BookingRequest(Long laboratoryId, LocalDateTime startTime, LocalDateTime endTime, String purpose) {
        this.laboratoryId = laboratoryId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
    }

    // Getters e Setters (inalterados)
    public Long getLaboratoryId() { return laboratoryId; }
    public void setLaboratoryId(Long laboratoryId) { this.laboratoryId = laboratoryId; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public List<PeripheralRequest> getPeripherals() { return peripherals; }
    public void setPeripherals(List<PeripheralRequest> peripherals) { this.peripherals = peripherals; }

    // --- 2. GETTERS E SETTERS ADICIONADOS ---
    public Boolean getIsRecurring() { return isRecurring; }
    public void setIsRecurring(Boolean isRecurring) { this.isRecurring = isRecurring; }

    public Integer getNumWeeks() { return numWeeks; }
    public void setNumWeeks(Integer numWeeks) { this.numWeeks = numWeeks; }
    // --- FIM DA ADIÇÃO ---
}