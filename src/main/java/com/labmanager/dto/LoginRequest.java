package com.labmanager.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para requisição de login
 * Contém as credenciais do usuário (RA e senha)
 */
public class LoginRequest {

    @NotBlank // Garante que o RA não seja nulo ou vazio
    private String ra;

    @NotBlank // Garante que a senha não seja nula ou vazia
    private String password;

    // Construtores
    public LoginRequest() {}

    public LoginRequest(String ra, String password) {
        this.ra = ra;
        this.password = password;
    }

    // Getters e Setters
    public String getRa() { return ra; }
    public void setRa(String ra) { this.ra = ra; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}