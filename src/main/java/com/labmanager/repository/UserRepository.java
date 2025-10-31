package com.labmanager.repository;

import com.labmanager.model.User;
import com.labmanager.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações de banco de dados relacionadas aos usuários
 * Extende JpaRepository para operações CRUD básicas
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Busca usuário pelo RA (Registro Acadêmico) - usado no login
    Optional<User> findByRa(String ra);
    
    // Busca usuário pelo email
    Optional<User> findByEmail(String email);
    
    // Verifica se existe usuário com determinado RA
    Boolean existsByRa(String ra);
    
    // Verifica se existe usuário com determinado email
    Boolean existsByEmail(String email);
    
    // Busca usuários por tipo (role) e que estejam ativos
    List<User> findByRoleAndActiveTrue(UserRole role);
    
    // Busca todos os usuários ativos
    List<User> findByActiveTrue();
    
    // Busca usuários por nome (busca parcial, case insensitive)
    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')) AND u.active = true")
    List<User> findByNameContainingIgnoreCaseAndActiveTrue(@Param("name") String name);
    
    // Conta total de usuários ativos
    long countByActiveTrue();
    
    // Conta usuários por tipo
    long countByRoleAndActiveTrue(UserRole role);
}
