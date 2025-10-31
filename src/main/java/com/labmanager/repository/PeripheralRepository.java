package com.labmanager.repository;

import com.labmanager.model.Laboratory;
import com.labmanager.model.Peripheral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para operações de banco de dados relacionadas aos periféricos
 */
@Repository
public interface PeripheralRepository extends JpaRepository<Peripheral, Long> {
    
    // Busca periféricos ativos
    List<Peripheral> findByActiveTrue();
    
    // Busca periféricos de um laboratório específico
    List<Peripheral> findByLaboratoryAndActiveTrue(Laboratory laboratory);
    
    // Busca periféricos por laboratório ID
    List<Peripheral> findByLaboratoryIdAndActiveTrue(Long laboratoryId);
    
    // Busca periféricos por nome (busca parcial, case insensitive)
    @Query("SELECT p FROM Peripheral p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND p.active = true")
    List<Peripheral> findByNameContainingIgnoreCaseAndActiveTrue(@Param("name") String name);
    
    // Conta total de periféricos ativos
    long countByActiveTrue();
    
    // Conta periféricos por laboratório
    long countByLaboratoryAndActiveTrue(Laboratory laboratory);
}
