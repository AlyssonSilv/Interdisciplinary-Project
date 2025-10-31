package com.labmanager.controller;

import com.labmanager.dto.LoginRequest;
import com.labmanager.dto.LoginResponse;
import com.labmanager.model.User;
import com.labmanager.model.UserRole;
import com.labmanager.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper; // <-- IMPORTAR ISTO!
import com.fasterxml.jackson.core.JsonProcessingException; // <-- IMPORTAR ISTO!


/**
 * Controlador de autenticação
 * Endpoints: /api/auth/*
 * Responsável por login, registro e operações de autenticação
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = null; // Declarar fora do try para depuração
        try {
            loginResponse = authService.authenticateUser(loginRequest);

            // --- BLOCO DE DEPURACAO ADICIONADO AQUI ---
            // Isso nos dará o JSON exato que o controller tentará enviar.
            ObjectMapper mapper = new ObjectMapper();
            System.out.println("LoginResponse JSON FINAL no AuthController (antes de enviar): " + mapper.writeValueAsString(loginResponse));
            // --- FIM DO BLOCO DE DEPURACAO ---

            return ResponseEntity.ok(loginResponse);
        } catch (JsonProcessingException jsonEx) {
            // Captura erros de serialização do JSON explicitamente
            System.err.println("ERRO DE SERIALIZACAO JSON NO AUTHCONTROLLER (authenticateUser): " + jsonEx.getMessage());
            // Para ver o stack trace completo no log, use: jsonEx.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro interno na serialização da resposta de login.");
        }
        catch (Exception e) {
            // Captura outras exceções do AuthService ou de validação
            System.err.println("Erro no login (AuthController - authenticateUser): " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Erro no login: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            User user = authService.registerUser(
                    signUpRequest.getRa(),
                    signUpRequest.getName(),
                    signUpRequest.getEmail(),
                    signUpRequest.getPassword(),
                    signUpRequest.getRole());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            User currentUser = authService.getCurrentUser();
            return ResponseEntity.ok(currentUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao buscar usuário: " + e.getMessage());
        }
    }

    public static class SignUpRequest {
        private String ra;
        private String name;
        private String email;
        private String password;
        private UserRole role;

        public String getRa() {
            return ra;
        }

        public void setRa(String ra) {
            this.ra = ra;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public UserRole getRole() {
            return role;
        }

        public void setRole(UserRole role) {
            this.role = role;
        }
    }
}