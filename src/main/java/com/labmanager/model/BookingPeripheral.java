package com.labmanager.model;

import jakarta.persistence.*; // Anotações JPA
import java.time.LocalDateTime; // Para timestamps

/**
 * Entidade de relacionamento entre Booking e Peripheral
 * Representa quais periféricos foram solicitados em cada agendamento
 * Mapeia para a tabela 'booking_peripherals' no banco de dados
 */
@Entity // Declara que é uma entidade JPA
@Table(name = "booking_peripherals") // Mapeia para a tabela 'booking_peripherals'
public class BookingPeripheral {

    @Id // Chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Geração automática de ID
    private Long id;

    // Relacionamento com agendamento
    @ManyToOne(fetch = FetchType.LAZY) // Muitos BookingPeripherals para um Booking, carregamento sob demanda
    @JoinColumn(name = "booking_id") // Coluna de junção na tabela 'booking_peripherals'
    private Booking booking;

    // Relacionamento com periférico
    @ManyToOne(fetch = FetchType.LAZY) // Muitos BookingPeripherals para um Peripheral, carregamento sob demanda
    @JoinColumn(name = "peripheral_id") // Coluna de junção na tabela 'booking_peripherals'
    private Peripheral peripheral; // Assumimos que a classe Peripheral existe

    // Quantidade solicitada do periférico
    private Integer quantity = 1; // Valor padrão: 1

    // Timestamp de criação (para auditoria)
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Método de callback JPA para gerenciar timestamp de criação automaticamente
    @PrePersist // Executado antes de persistir uma nova entidade
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Construtores
    public BookingPeripheral() {}

    public BookingPeripheral(Booking booking, Peripheral peripheral, Integer quantity) {
        this.booking = booking;
        this.peripheral = peripheral;
        this.quantity = quantity;
    }

    // Getters e Setters (padrão)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Peripheral getPeripheral() { return peripheral; }
    public void setPeripheral(Peripheral peripheral) { this.peripheral = peripheral; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}