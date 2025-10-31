package com.labmanager.model;

/**
 * Enum que define os tipos de usuário no sistema
 * Usado para controle de acesso e autorização
 */
public enum UserRole {
    ADMIN,      // Administrador do sistema - acesso total
    PROFESSOR,  // Professor - pode gerenciar suas aulas e aprovar agendamentos
    ALUNO       // Aluno - pode fazer agendamentos e consultar seus dados
}
