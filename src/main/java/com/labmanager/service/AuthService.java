package com.labmanager.service;

import com.labmanager.dto.LoginRequest;
import com.labmanager.dto.LoginResponse;
import com.labmanager.model.User;
import com.labmanager.model.UserRole;
import com.labmanager.repository.UserRepository;
import com.labmanager.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Adicione estas importações para a depuração do toString() se você usar ObjectMapper
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

/**
 * Serviço de autenticação
 * Responsável por login, registro e operações relacionadas à autenticação
 */
@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    /**
     * Realiza o login do usuário
     * Autentica as credenciais e gera um token JWT
     * @param loginRequest Dados de login (RA e senha)
     * @return Resposta com token JWT e dados do usuário
     */
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getRa(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByRa(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        LoginResponse loginResponse = new LoginResponse(jwt, user.getId(), user.getRa(), user.getName(), user.getEmail(), user.getRole());

        // --- LINHA DE DEPURAR ADICIONADA ---
        // Esta linha imprimirá o conteúdo do LoginResponse no console do backend.
        // É CRUCIAL que seu LoginResponse.java tenha um bom método toString() ou use o ObjectMapper.
        System.out.println("LoginResponse gerado (AuthService): " + loginResponse.toString());
        // Se você tiver problemas com o toString(), descomente as linhas abaixo para usar ObjectMapper:
        /*
        try {
            ObjectMapper mapper = new ObjectMapper();
            System.out.println("LoginResponse JSON (AuthService): " + mapper.writeValueAsString(loginResponse));
        } catch (JsonProcessingException e) {
            System.err.println("Erro ao serializar LoginResponse para depuração: " + e.getMessage());
        }
        */
        // --- FIM DA LINHA DE DEPURAR ---

        return loginResponse;
    }

    /**
     * Registra um novo usuário no sistema
     * @param ra RA do usuário
     * @param name Nome do usuário
     * @param email Email do usuário
     * @param password Senha do usuário
     * @param role Tipo de usuário (ADMIN, PROFESSOR, ALUNO)
     * @return Usuário criado
     */
    public User registerUser(String ra, String name, String email, String password, UserRole role) {
        if (userRepository.existsByRa(ra)) {
            throw new RuntimeException("Erro: RA já está em uso!");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Erro: Email já está em uso!");
        }

        UserRole expectedRole = determineRoleFromRa(ra);

        if (expectedRole != role) {
            throw new IllegalArgumentException("Inconsistência de dados: O RA fornecido não corresponde ao tipo de usuário esperado.");
        }

        User user = new User(ra, name, email, encoder.encode(password), role);

        return userRepository.save(user);
    }

    /**
     * Busca o usuário atual autenticado
     * @return Usuário atual
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String ra = authentication.getName();
        return userRepository.findByRa(ra)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    /**
     * NOVO MÉTODO DE SEGURANÇA INTERNA
     * Determina o papel do usuário com base no formato do RA.
     * Serve como uma camada de segurança adicional para validar o papel recebido do frontend.
     * @param ra Registro Acadêmico do usuário
     * @return UserRole inferido
     * @throws IllegalArgumentException se o formato do RA for inválido ou não corresponder a nenhum papel conhecido.
     */
    public UserRole determineRoleFromRa(String ra) {
        if (ra.matches("^\\d{6}$")) {
            return UserRole.ALUNO;
        }
        if (ra.matches("^\\d-\\d{1,5}$")) {
            return UserRole.PROFESSOR;
        }
        if (ra.matches("^\\d{4}$")) {
            return UserRole.ADMIN;
        }
        throw new IllegalArgumentException("Formato de RA inválido para determinar a categoria de usuário no backend.");
    }
}