// src/main/java/com/labmanager/controller/DashboardController.java
package com.labmanager.controller;

// IMPORTS ADICIONADOS
import com.labmanager.dto.AnalyticsResponseDto; 
import com.labmanager.dto.BookingResponseDto;
// ---
import com.labmanager.dto.DashboardStatsResponse;
import com.labmanager.model.Booking; // Mantenha esta importação para o service
import com.labmanager.service.DashboardService;
import com.labmanager.service.BookingService;
import com.labmanager.model.User;
import com.labmanager.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.labmanager.model.BookingStatus;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors; // Adicione esta importação para Collectors

/**
 * Controlador do dashboard
 * Endpoints: /api/dashboard/*
 * Responsável por fornecer dados estatísticos e atividades para os dashboards
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AuthService authService;

    /**
     * Endpoint para estatísticas gerais do sistema
     * GET /api/dashboard/stats
     * Acessível por todos os usuários autenticados (Alunos, Professores)
     * @return Estatísticas básicas do sistema
     */
    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getStats() {
        try {
            DashboardStatsResponse stats = dashboardService.getBasicStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Erro ao obter estatísticas básicas do dashboard: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao obter estatísticas básicas: " + e.getMessage());
        }
    }

    /**
     * Endpoint para estatísticas administrativas completas
     * GET /api/dashboard/admin/stats
     * Acessível apenas por administradores
     * @return Estatísticas completas do sistema
     */
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminStats() {
        try {
            DashboardStatsResponse stats = dashboardService.getAdminStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Erro ao obter estatísticas do dashboard ADMIN: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao obter estatísticas de admin: " + e.getMessage());
        }
    }

    // --- NOVOS ENDPOINTS PARA DASHBOARD DE PROFESSOR E ALUNO ---

    /**
     * Endpoint para estatísticas específicas do professor
     * GET /api/dashboard/professor/stats
     * Acessível apenas por professores
     * @return Estatísticas relevantes para o professor
     */
    @GetMapping("/professor/stats")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> getProfessorStats() {
        try {
            DashboardStatsResponse stats = dashboardService.getBasicStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Erro ao obter estatísticas do dashboard PROFESSOR: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao obter estatísticas de professor: " + e.getMessage());
        }
    }

    /**
     * Endpoint para estatísticas específicas do aluno
     * GET /api/dashboard/student/stats
     * Acessível apenas por alunos
     * @return Estatísticas relevantes para o aluno
     */
    @GetMapping("/student/stats")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<?> getStudentStats() {
        try {
            DashboardStatsResponse stats = dashboardService.getBasicStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Erro ao obter estatísticas do dashboard ALUNO: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao obter estatísticas de aluno: " + e.getMessage());
        }
    }

    /**
     * Endpoint para agendamentos do usuário logado (Aluno/Professor)
     * GET /api/bookings/my-bookings
     * @return Lista de agendamentos do usuário
     */
    @GetMapping("/bookings/my-bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyBookings() {
        try {
            User currentUser = authService.getCurrentUser();
            // bookingService.findBookingsByUser já retorna List<BookingResponseDto>
            List<BookingResponseDto> myBookings = bookingService.findBookingsByUser(currentUser.getId()); 
            return ResponseEntity.ok(myBookings);
        } catch (Exception e) {
            System.err.println("Erro ao obter agendamentos do usuário logado: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao buscar seus agendamentos: " + e.getMessage());
        }
    }

    /**
     * Endpoint para agendamentos pendentes (geralmente para Admin/Professor)
     * GET /api/dashboard/bookings/pending
     * @return Lista de agendamentos pendentes
     */
    @GetMapping("/bookings/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<?> getPendingBookings() {
        try {
            // bookingService.findBookingsByStatus já retorna List<BookingResponseDto>
            List<BookingResponseDto> pendingBookings = bookingService.findBookingsByStatus(com.labmanager.model.BookingStatus.PENDING);
            return ResponseEntity.ok(pendingBookings);
        } catch (Exception e) {
            System.err.println("Erro ao obter agendamentos pendentes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao obter agendamentos pendentes: " + e.getMessage());
        }
    }

    /**
     * Endpoint para alertas do sistema (geralmente para Admin)
     * GET /api/dashboard/alerts
     * @return Lista de alertas do sistema
     */
    @GetMapping("/alerts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemAlerts() {
        try {
            List<String> alerts = List.of("Alerta 1: Lab X em manutenção", "Alerta 2: Servidor com uso alto"); // Mock simples
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            System.err.println("Erro ao obter alertas do sistema: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao obter alertas do sistema: " + e.getMessage());
        }
    }

    // --- NOVO ENDPOINT ADICIONADO ---
    /**
     * Endpoint para dados analíticos do dashboard admin (gráficos).
     * GET /api/dashboard/admin/analytics
     * Acessível apenas por administradores.
     * @return DTO contendo dados formatados para os gráficos do Chart.js.
     */
    @GetMapping("/admin/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminAnalytics() {
        try {
            AnalyticsResponseDto analyticsData = dashboardService.getAdminAnalytics();
            return ResponseEntity.ok(analyticsData);
        } catch (Exception e) {
            System.err.println("Erro ao obter dados analíticos do dashboard ADMIN: " + e.getMessage());
            e.printStackTrace(); // Ajuda a debugar
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao obter dados analíticos: " + e.getMessage());
        }
    }
    // --- FIM DO NOVO ENDPOINT ---


    /**
     * Endpoint para atividades recentes (geral)
     * GET /api/dashboard/activities
     * @return Lista de agendamentos recentes (últimos 7 dias)
     */
    @GetMapping("/activities")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getRecentActivities() {
        try {
            // CORRIGIDO: Chamar getRecentActivities do DashboardService e converter para DTO
            List<BookingResponseDto> activities = dashboardService.getRecentActivities()
                .stream()
                .map(BookingResponseDto::new) // Converte para DTO
                .collect(Collectors.toList());
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            System.err.println("Erro ao obter atividades recentes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao obter atividades recentes: " + e.getMessage());
        }
    }

    /**
     * Endpoint para próximos agendamentos (geral)
     * GET /api/dashboard/upcoming
     * @return Lista de agendamentos futuros (próximos 7 dias)
     */
    @GetMapping("/upcoming")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUpcomingBookings() {
        try {
            // CORRIGIDO: Chamar getUpcomingBookings do DashboardService e converter para DTO
            List<BookingResponseDto> upcoming = dashboardService.getUpcomingBookings()
                .stream()
                .map(BookingResponseDto::new) // Converte para DTO
                .collect(Collectors.toList());
            return ResponseEntity.ok(upcoming);
        } catch (Exception e) {
            System.err.println("Erro ao obter próximos agendamentos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao obter próximos agendamentos: " + e.getMessage());
        }
    }

    // --- ENDPOINTS PARA AÇÕES EM AGENDAMENTOS (APROVAR/REJEITAR/DELETAR) ---

    /**
     * Endpoint para atualizar o status de um agendamento
     * PATCH /api/bookings/{id}/status
     * Acessível apenas por administradores ou professores
     * @param id ID do agendamento
     * @param requestBody Corpo da requisição com o novo status e, opcionalmente, motivo da rejeição
     * @return ResponseEntity indicando sucesso ou falha
     */
    @PatchMapping("/bookings/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        try {
            String status = requestBody.get("status");
            String rejectedReason = requestBody.get("rejectedReason");

            if (status == null || (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED"))) {
                return ResponseEntity.badRequest().body("Status inválido. Use 'APPROVED' ou 'REJECTED'.");
            }

            BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
            bookingService.updateBookingStatus(id, newStatus, rejectedReason);
            return ResponseEntity.ok("Status do agendamento atualizado com sucesso.");
        } catch (Exception e) {
            System.err.println("Erro ao atualizar status do agendamento " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar status do agendamento.");
        }
    }

    /**
     * Endpoint para deletar um agendamento
     * DELETE /api/bookings/{id}
     * @param id ID do agendamento
     * @return ResponseEntity indicando sucesso ou falha
     */
    @DeleteMapping("/bookings/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ALTERADO: Apenas ADMIN pode deletar
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok("Agendamento excluído com sucesso.");
        } catch (Exception e) {
            System.err.println("Erro ao excluir agendamento " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao excluir agendamento.");
        }
    }

    // --- ENDPOINTS PARA CRIAÇÃO DE RESERVA (NOVA-RESERVA) ---
    /**
     * Endpoint para iniciar uma nova reserva.
     * POST /api/laboratories/{labId}/reserve
     * Acessível por Alunos e Professores.
     * Este endpoint seria o primeiro passo para uma reserva, antes de coletar todos os detalhes.
     * @param labId ID do laboratório a ser reservado.
     * @return Resposta de sucesso ou falha.
     */
    @PostMapping("/laboratories/{labId}/reserve")
    @PreAuthorize("hasAnyRole('ALUNO', 'PROFESSOR')")
    public ResponseEntity<?> initiateReservation(@PathVariable Long labId) {
        try {
            return ResponseEntity.ok("Iniciando processo de reserva para o laboratório " + labId + ". Prossiga para os detalhes.");
        } catch (Exception e) {
            System.err.println("Erro ao iniciar reserva para laboratório " + labId + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao iniciar reserva.");
        }
    }
}