package com.labmanager.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders; // Ainda importado, mas não usado para a geração da chave principal
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import jakarta.annotation.PostConstruct;

/**
 * Utilitário para operações com JWT (JSON Web Tokens)
 * Responsável por gerar, validar e extrair informações dos tokens
 */
@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${labmanager.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    // NOVO: Injete o valor da chave secreta do application.properties
    @Value("${labmanager.app.jwtSecret}")
    private String jwtSecretConfigValue; // O valor da string Base64 da chave

    private Key secretKey; // A chave real a ser usada para assinatura

    @PostConstruct
    public void init() {
        // CORREÇÃO AQUI: Use a chave do application.properties para gerar a SecretKey.
        // O valor em 'labmanager.app.jwtSecret' DEVE ser uma string Base64 LONGA o suficiente (mínimo 64 bytes para HS512).
        // Se a sua string for curta demais, o Keys.hmacShaKeyFor pode falhar ou gerar uma chave fraca.
        try {
            this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecretConfigValue));
        } catch (IllegalArgumentException e) {
            // Este erro ocorre se a string Base64 for inválida ou não tiver o tamanho correto para o algoritmo.
            logger.error("A chave JWT em application.properties é inválida para decodificação Base64 ou muito curta para HS512. Usando uma chave gerada aleatoriamente como fallback. ERRO: {}", e.getMessage());
            this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512); // Fallback seguro (mas com tokens invalidando ao reiniciar)
        }
    }

    // Método auxiliar para retornar a chave secreta segura
    private Key key() {
        return secretKey;
    }

    /**
     * Gera um token JWT para o usuário autenticado
     * @param authentication Objeto de autenticação do Spring Security
     * @return Token JWT como string
     */
    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername())) // RA do usuário como subject
                .setIssuedAt(new Date()) // Data de emissão
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Data de expiração
                .signWith(key(), SignatureAlgorithm.HS512) // Assinatura com a chave segura e HS512
                .compact();
    }

    /**
     * Extrai o RA (username) do token JWT
     * @param token Token JWT
     * @return RA do usuário
     */
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                   .parseClaimsJws(token).getBody().getSubject();
    }

    /**
     * Valida se o token JWT é válido
     * @param authToken Token JWT a ser validado
     * @return true se válido, false caso contrário
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Token JWT inválido: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Token JWT expirado: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Token JWT não suportado: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string está vazia: {}", e.getMessage());
        } catch (io.jsonwebtoken.security.SignatureException e) { // Captura especificamente erro de assinatura
            logger.error("Assinatura JWT inválida: {}", e.getMessage());
        }

        return false;
    }
}