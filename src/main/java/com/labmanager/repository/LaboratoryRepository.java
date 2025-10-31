package com.labmanager.repository;

import com.labmanager.model.Laboratory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositório para operações de banco de dados relacionadas aos laboratórios
 */
@Repository
public interface LaboratoryRepository extends JpaRepository<Laboratory, Long> {
    
    // Busca laboratórios ativos
    List<Laboratory> findByActiveTrue();
    
    // Busca laboratórios por nome (busca parcial, case insensitive)
    @Query("SELECT l FROM Laboratory l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :name, '%')) AND l.active = true")
    List<Laboratory> findByNameContainingIgnoreCaseAndActiveTrue(@Param("name") String name);
    
    // Busca laboratórios disponíveis em um período específico
    // Um laboratório está disponível se não tem agendamentos aprovados no período
    @Query("SELECT l FROM Laboratory l WHERE l.active = true AND l.id NOT IN " +
           "(SELECT DISTINCT b.laboratory.id FROM Booking b WHERE " +
           "b.status = 'APPROVED' AND " +
           "((b.startTime <= :endTime AND b.endTime >= :startTime)))")
    List<Laboratory> findAvailableLaboratories(@Param("startTime") LocalDateTime startTime, 
                                             @Param("endTime") LocalDateTime endTime);
    
    // Conta total de laboratórios ativos
    long countByActiveTrue();
}
