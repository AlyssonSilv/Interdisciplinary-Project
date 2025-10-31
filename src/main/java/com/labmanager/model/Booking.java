// src/main/java/com/labmanager/model/Booking.java
package com.labmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList; // Importar ArrayList
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Entidade que representa um agendamento de laboratório
 * Mapeia para a tabela 'bookings' no banco de dados
 */
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento com usuário - quem fez o agendamento
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @NotNull
    @JsonIgnore // ADICIONADO: Ignora a serialização do usuário para evitar problemas de lazy loading/ciclos
    private User user;

    // Relacionamento com laboratório - qual laboratório foi agendado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "laboratory_id")
    @NotNull
    @JsonIgnore // ADICIONADO: Ignora a serialização do laboratório para evitar problemas de lazy loading/ciclos
    private Laboratory laboratory;

    // Data e hora de início do agendamento
    @Column(name = "start_time")
    @NotNull
    private LocalDateTime startTime;

    // Data e hora de fim do agendamento
    @Column(name = "end_time")
    @NotNull
    private LocalDateTime endTime;

    // Finalidade do agendamento (aula, pesquisa, etc.)
    @Size(max = 500)
    private String purpose;

    // Status atual do agendamento
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private BookingStatus status = BookingStatus.PENDING;

    // Observações do administrador (motivo da rejeição, etc.)
    @Size(max = 1000)
    @Column(name = "admin_notes")
    private String adminNotes;

    // Timestamps para auditoria
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relacionamento com periféricos solicitados no agendamento
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // ADICIONADO: Ignora a serialização dos periféricos do agendamento
    private List<BookingPeripheral> bookingPeripherals = new ArrayList<>(); // <<-- ADICIONADO: Inicialização da lista

    // Métodos de callback JPA para gerenciar timestamps automaticamente
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Construtores
    public Booking() {}

    public Booking(User user, Laboratory laboratory, LocalDateTime startTime,
                   LocalDateTime endTime, String purpose) {
        this.user = user;
        this.laboratory = laboratory;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        // A lista já é inicializada na declaração, então não precisa aqui novamente
    }

    // Getters e Setters (padrão)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Laboratory getLaboratory() { return laboratory; }
    public void setLaboratory(Laboratory laboratory) { this.laboratory = laboratory; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<BookingPeripheral> getBookingPeripherals() { return bookingPeripherals; }
    public void setBookingPeripherals(List<BookingPeripheral> bookingPeripherals) {
        this.bookingPeripherals = bookingPeripherals;
    }
}