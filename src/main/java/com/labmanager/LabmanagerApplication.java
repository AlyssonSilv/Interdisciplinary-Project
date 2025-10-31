package com.labmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da aplicação Spring Boot
 * Ponto de entrada do sistema LabManager
 */
@SpringBootApplication
public class LabmanagerApplication {

    /**
     * Método main que inicia a aplicação Spring Boot
     * Configura automaticamente todos os componentes necessários
     * @param args Argumentos da linha de comando
     */
    public static void main(String[] args) {
        SpringApplication.run(LabmanagerApplication.class, args);
        System.out.println("=================================");
        System.out.println("🚀 LabManager Backend iniciado!");
        System.out.println("📍 Acesse: http://localhost:8080/api");
        System.out.println("📚 Documentação dos endpoints disponível no README.md");
        System.out.println("=================================");
    }
}
