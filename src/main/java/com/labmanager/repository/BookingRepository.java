package com.labmanager.repository;

import com.labmanager.model.Booking;
import com.labmanager.model.BookingStatus;
import com.labmanager.model.User; // Import necessário
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
// import java.util.Optional; // JpaRepository já inclui

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // --- MÉTODOS NECESSÁRIOS PARA O BookingService.java ---

    /**
     * Busca agendamentos de um usuário específico, ordenados pela data de criação (mais recente primeiro).
     * Usado por getMyBookings() e findBookingsByUser().
     */
    List<Booking> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Busca agendamentos por status, ordenados pela data de criação (mais antigo primeiro).
     * Usado por getPendingBookings().
     */
    List<Booking> findByStatusOrderByCreatedAtAsc(BookingStatus status);

    /**
     * Busca agendamentos por status, ordenados pela data de criação (mais recente primeiro).
     * Usado por findBookingsByStatus().
     */
    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    /**
     * Query customizada para encontrar agendamentos conflitantes (que sobrepõem o horário).
     * Usado por createBooking().
     */
    @Query("SELECT b FROM Booking b WHERE b.laboratory.id = :labId AND b.status != 'CANCELLED' AND b.status != 'REJECTED' AND " +
           "((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(@Param("labId") Long labId,
                                        @Param("startTime") LocalDateTime startTime,
                                        @Param("endTime") LocalDateTime endTime);

    /**
     * Query customizada para buscar agendamentos dentro de um período.
     * Usado por getBookingsInPeriod().
     */
    @Query("SELECT b FROM Booking b WHERE b.startTime >= :startDate AND b.endTime <= :endDate")
    List<Booking> findBookingsInPeriod(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);


    // --- MÉTODOS NECESSÁRIOS PARA O DashboardService.java ---

    /**
     * Conta agendamentos por status.
     * Usado por getAdminStats() e getBasicStats().
     */
    long countByStatus(BookingStatus status);

    /**
     * Busca agendamentos por ID de usuário (sem ordenação específica aqui).
     * Usado por DashboardController.getMyBookings() (via BookingService).
     */
    List<Booking> findByUserId(Long userId);

    /**
     * Busca agendamentos por status (sem ordenação específica aqui).
     * Usado por DashboardController.getPendingBookings() (via BookingService).
     */
    List<Booking> findByStatus(BookingStatus status);

    /**
     * Busca atividades recentes (últimos 7 dias).
     * Usado por getRecentActivities().
     */
    @Query("SELECT b FROM Booking b WHERE b.startTime >= :sevenDaysAgo")
    List<Booking> findRecentBookings(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    /**
     * Busca próximos agendamentos aprovados (próximos 7 dias).
     * Usado por getUpcomingBookings().
     */
    @Query("SELECT b FROM Booking b WHERE b.status = 'APPROVED' AND b.startTime >= :now AND b.startTime <= :sevenDaysFromNow ORDER BY b.startTime ASC")
    List<Booking> findUpcomingBookings(@Param("now") LocalDateTime now, @Param("sevenDaysFromNow") LocalDateTime sevenDaysFromNow);


    // --- MÉTODOS PARA OS GRÁFICOS (ÁREA ANALÍTICA) ---

    /**
     * Retorna a contagem de agendamentos por dia para um status específico.
     * Usado por getAdminAnalytics().
     */
    @Query("SELECT FUNCTION('DATE', b.startTime) as dia, COUNT(b.id) as contagem " +
           "FROM Booking b " +
           "WHERE b.status = :status AND b.startTime >= :startDate " +
           "GROUP BY FUNCTION('DATE', b.startTime) " +
           "ORDER BY dia ASC")
    List<Object[]> findBookingsPerDayByStatus(@Param("status") BookingStatus status, @Param("startDate") LocalDateTime startDate);

    /**
     * Retorna a contagem de agendamentos (Aprovados) por laboratório.
     * Usado por getAdminAnalytics() (Popularidade do Lab).
     */
    @Query("SELECT b.laboratory.name, COUNT(b.id) as contagem " +
           "FROM Booking b " +
           "WHERE b.status = 'APPROVED' AND b.startTime >= :startDate " +
           "GROUP BY b.laboratory.name " +
           "ORDER BY contagem DESC")
    List<Object[]> findLabPopularity(@Param("startDate") LocalDateTime startDate);

    // --- NOVO MÉTODO NECESSÁRIO PARA O LaboratoryService.java ---

    /**
     * Busca agendamentos APROVADOS para um laboratório específico dentro de um
     * intervalo de datas/horas.
     * Usado por LaboratoryService.getAvailableTimeSlotsForLab()
     */
    @Query("SELECT b FROM Booking b WHERE b.laboratory.id = :labId " +
           "AND b.status = com.labmanager.model.BookingStatus.APPROVED " +
           "AND b.startTime < :endOfDay AND b.endTime > :startOfDay") // Verifica sobreposição
    List<Booking> findApprovedBookingsForLabInTimeRange(@Param("labId") Long labId,
                                                      @Param("startOfDay") LocalDateTime startOfDay,
                                                      @Param("endOfDay") LocalDateTime endOfDay);
}