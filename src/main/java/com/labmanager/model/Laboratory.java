package com.labmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore; // Importe esta anotação

/**
 * Entidade que representa um laboratório
 * Mapeia para a tabela 'laboratories' no banco de dados
 */
@Entity
@Table(name = "laboratories")
public class Laboratory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    private String name;
    
    @Size(max = 500)
    private String description;
    
    // Capacidade máxima de pessoas no laboratório
    private Integer capacity;
    
    // Localização física do laboratório
    @Size(max = 200)
    private String location;
    
    // Controle de laboratórios ativos/inativos
    private Boolean active = true;
    
    // Timestamps para auditoria
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relacionamento com agendamentos - um laboratório pode ter vários agendamentos
    @OneToMany(mappedBy = "laboratory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // ADICIONADO: Ignora a serialização dos agendamentos
    private List<Booking> bookings;
    
    // Relacionamento com periféricos - um laboratório pode ter vários periféricos
    @OneToMany(mappedBy = "laboratory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // ADICIONADO: Ignora a serialização dos periféricos
    private List<Peripheral> peripherals;
    
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
    public Laboratory() {}
    
    public Laboratory(String name, String description, Integer capacity, String location) {
        this.name = name;
        this.description = description;
        this.capacity = capacity;
        this.location = location;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
    
    public List<Peripheral> getPeripherals() { return peripherals; }
    public void setPeripherals(List<Peripheral> peripherals) { this.peripherals = peripherals; }
}