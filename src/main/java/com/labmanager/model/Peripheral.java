package com.labmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore; // Importe esta anotação

/**
 * Entidade que representa um periférico/equipamento do laboratório
 * Mapeia para a tabela 'peripherals' no banco de dados
 */
@Entity
@Table(name = "peripherals")
public class Peripheral {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @Size(max = 500)
    private String description;
    
    // Quantidade disponível do periférico
    private Integer quantity = 1;
    
    // Relacionamento com laboratório - a qual laboratório pertence
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "laboratory_id")
    @JsonIgnore // ADICIONADO: Ignora a serialização do laboratório para evitar LazyInitializationException
    private Laboratory laboratory;
    
    // Controle de periféricos ativos/inativos
    private Boolean active = true;
    
    // Timestamps para auditoria
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relacionamento com agendamentos que solicitaram este periférico
    @OneToMany(mappedBy = "peripheral", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Garante que não haja serialização cíclica ou de proxies não inicializados
    private List<BookingPeripheral> bookingPeripherals;
    
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
    public Peripheral() {}
    
    public Peripheral(String name, String description, Integer quantity, Laboratory laboratory) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.laboratory = laboratory;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Laboratory getLaboratory() { return laboratory; }
    public void setLaboratory(Laboratory laboratory) { this.laboratory = laboratory; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<BookingPeripheral> getBookingPeripherals() { return bookingPeripherals; }
    public void setBookingPeripherals(List<BookingPeripheral> bookingPeripherals) { 
        this.bookingPeripherals = bookingPeripherals; 
    }
}