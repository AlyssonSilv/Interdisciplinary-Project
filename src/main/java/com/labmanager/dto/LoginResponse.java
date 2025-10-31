package com.labmanager.dto;

import com.labmanager.model.UserRole;
// Adicione estas importações para o ObjectMapper no toString()
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * DTO para resposta de login
 * Contém o token JWT e informações básicas do usuário
 */
public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String ra;
    private String name;
    private String email;
    private UserRole role;

    // --- RECOMENDAÇÃO: Inclua aqui outras propriedades que seu LoginResponse pode retornar ---
    // Se o seu modelo User tem department, phone, createdAt, isActive, e você
    // quer que o frontend os receba no login, eles devem estar aqui também.
    // Exemplo:
    // private String department;
    // private String phone;
    // private java.time.LocalDateTime createdAt;
    // private Boolean isActive;
    // --- FIM DA RECOMENDAÇÃO ---

    // Construtores
    public LoginResponse() {}

    public LoginResponse(String token, Long id, String ra, String name, String email, UserRole role) {
        this.token = token;
        this.id = id;
        this.ra = ra;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // --- RECOMENDAÇÃO: Adicione um construtor com todos os campos se você os adicionar ---
    // public LoginResponse(String token, Long id, String ra, String name, String email, UserRole role,
    //                      String department, String phone, java.time.LocalDateTime createdAt, Boolean isActive) {
    //     this(token, id, ra, name, email, role); // Chama o construtor base
    //     this.department = department;
    //     this.phone = phone;
    //     this.createdAt = createdAt;
    //     this.isActive = isActive;
    // }
    // --- FIM DA RECOMENDAÇÃO ---


    // Getters e Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRa() { return ra; }
    public void setRa(String ra) { this.ra = ra; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    // --- RECOMENDAÇÃO: Adicione getters e setters para novos campos se necessário ---
    // public String getDepartment() { return department; }
    // public void setDepartment(String department) { this.department = department; }
    // public String getPhone() { return phone; }
    // public void setPhone(String phone) { this.phone = phone; }
    // public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    // public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    // public Boolean getIsActive() { return isActive; }
    // public void setIsActive(Boolean active) { isActive = active; }
    // --- FIM DA RECOMENDAÇÃO ---


    // --- DEPURANDO: SOBRESCREVENDO toString() para ver o conteúdo como JSON ---
    @Override
    public String toString() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            // Retorna o objeto como uma string JSON formatada para depuração
            return mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            // Fallback se a serialização JSON falhar
            return "LoginResponse{" +
                   "token='" + (token != null ? token.substring(0, Math.min(token.length(), 10)) + "..." : "null") + '\'' +
                   ", type='" + type + '\'' +
                   ", id=" + id +
                   ", ra='" + ra + '\'' +
                   ", name='" + name + '\'' +
                   ", email='" + email + '\'' +
                   ", role=" + role +
                   // Adicione outros campos relevantes aqui se eles forem o problema
                   '}';
        }
    }
    // --- FIM DA DEPURARÇÃO ---
}