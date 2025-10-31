package com.labmanager.dto;

public class BookingPeripheralDto {
    private Long peripheralId;
    private String peripheralName;
    private Integer quantity;

    public BookingPeripheralDto(Long peripheralId, String peripheralName, Integer quantity) {
        this.peripheralId = peripheralId;
        this.peripheralName = peripheralName;
        this.quantity = quantity;
    }

    // Getters
    public Long getPeripheralId() { return peripheralId; }
    public String getPeripheralName() { return peripheralName; }
    public Integer getQuantity() { return quantity; }

    // Setters
    public void setPeripheralId(Long peripheralId) { this.peripheralId = peripheralId; }
    public void setPeripheralName(String peripheralName) { this.peripheralName = peripheralName; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
