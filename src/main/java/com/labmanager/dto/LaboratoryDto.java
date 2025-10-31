package com.labmanager.dto;

public class LaboratoryDto {
    private Long id;
    private String name;
    private String location;
    // Adicione outros campos se precisar exibir mais detalhes do laboratório
    // private String description;
    // private Integer capacity;

    public LaboratoryDto(Long id, String name, String location) {
        this.id = id;
        this.name = name;
        this.location = location;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLocation() { return location; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setLocation(String location) { this.location = location; }
}