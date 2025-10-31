package com.labmanager.dto;

import com.labmanager.model.BookingStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class BookingResponseDto {
    private Long id;
    private UserDto user; // DTO do usuário
    private LaboratoryDto laboratory; // DTO do laboratório
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private BookingStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;
    private List<BookingPeripheralDto> peripherals; // DTOs dos periféricos

    public BookingResponseDto(Long id, UserDto user, LaboratoryDto laboratory, LocalDateTime startTime, LocalDateTime endTime, String purpose, BookingStatus status, String adminNotes, LocalDateTime createdAt, List<BookingPeripheralDto> peripherals) {
        this.id = id;
        this.user = user;
        this.laboratory = laboratory;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.status = status;
        this.adminNotes = adminNotes;
        this.createdAt = createdAt;
        this.peripherals = peripherals;
    }

    // Construtor que recebe a entidade Booking e converte para DTO
    public BookingResponseDto(com.labmanager.model.Booking booking) {
        this.id = booking.getId();
        // Converte User para UserDto
        this.user = new UserDto(
            booking.getUser().getId(),
            booking.getUser().getRa(),
            booking.getUser().getName(),
            booking.getUser().getEmail(),
            booking.getUser().getRole()
        );
        // Converte Laboratory para LaboratoryDto
        this.laboratory = new LaboratoryDto(
            booking.getLaboratory().getId(),
            booking.getLaboratory().getName(),
            booking.getLaboratory().getLocation()
        );
        this.startTime = booking.getStartTime();
        this.endTime = booking.getEndTime();
        this.purpose = booking.getPurpose();
        this.status = booking.getStatus();
        this.adminNotes = booking.getAdminNotes();
        this.createdAt = booking.getCreatedAt();
        // Converte lista de BookingPeripheral para BookingPeripheralDto
        this.peripherals = booking.getBookingPeripherals().stream()
            .map(bp -> new BookingPeripheralDto(
                bp.getPeripheral().getId(),
                bp.getPeripheral().getName(),
                bp.getQuantity()
            ))
            .collect(Collectors.toList());
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
    public LaboratoryDto getLaboratory() { return laboratory; }
    public void setLaboratory(LaboratoryDto laboratory) { this.laboratory = laboratory; }
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
    public List<BookingPeripheralDto> getPeripherals() { return peripherals; }
    public void setPeripherals(List<BookingPeripheralDto> peripherals) { this.peripherals = peripherals; }
}
