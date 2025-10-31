package com.labmanager.dto;

import com.labmanager.model.UserRole; // Certifique-se de que UserRole está importado

public class UserDto {
    private Long id;
    private String ra;
    private String name;
    private String email;
    private UserRole role;

    public UserDto(Long id, String ra, String name, String email, UserRole role) {
        this.id = id;
        this.ra = ra;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Getters
    public Long getId() { return id; }
    public String getRa() { return ra; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public UserRole getRole() { return role; }

    // Setters (opcional, dependendo se você vai usar este DTO para requisições também)
    public void setId(Long id) { this.id = id; }
    public void setRa(String ra) { this.ra = ra; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(UserRole role) { this.role = role; }
}