package com.labmanager.controller;

import com.labmanager.dto.BookingRequest;
import com.labmanager.dto.BookingStatusUpdateRequest;
import com.labmanager.model.Booking;
import com.labmanager.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

// Importar o novo DTO de resposta
import com.labmanager.dto.BookingResponseDto; 

/**
 * Controlador de agendamentos
 * Endpoints: /api/bookings/*
 * Responsável por todas as operações relacionadas aos agendamentos
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * Endpoint para criar um novo agendamento
     * POST /api/bookings
     * @param bookingRequest Dados do agendamento
     * @return Agendamento criado ou erro
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ALUNO', 'PROFESSOR')")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        try {
            BookingResponseDto booking = bookingService.createBooking(bookingRequest); // Alterado tipo
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao criar agendamento: " + e.getMessage());
        }
    }

    /**
     * Endpoint para buscar agendamentos do usuário atual
     * GET /api/bookings/my-bookings
     * @return Lista de agendamentos do usuário ou erro
     */
    @GetMapping("/my-bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyBookings() {
        try {
            List<BookingResponseDto> bookings = bookingService.getMyBookings(); // Alterado tipo
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("Erro ao obter agendamentos do usuário logado: " + e.getMessage());
            return ResponseEntity.badRequest().body("Erro ao buscar seus agendamentos: " + e.getMessage());
        }
    }

    /**
     * Endpoint para buscar todos os agendamentos (apenas admin)
     * GET /api/bookings/all
     * @return Lista de todos os agendamentos ou erro
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllBookings() {
        try {
            List<BookingResponseDto> bookings = bookingService.getAllBookings(); // Alterado tipo
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("Erro ao obter todos os agendamentos: " + e.getMessage());
            return ResponseEntity.badRequest().body("Erro ao buscar todos os agendamentos: " + e.getMessage());
        }
    }

    /**
     * Endpoint para buscar agendamentos pendentes de aprovação
     * GET /api/bookings/pending
     * Acessível por administradores e professores
     * @return Lista de agendamentos pendentes ou erro
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<?> getPendingBookings() {
        try {
            List<BookingResponseDto> bookings = bookingService.getPendingBookings(); // Alterado tipo
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("Erro ao obter agendamentos pendentes: " + e.getMessage());
            return ResponseEntity.badRequest().body("Erro ao buscar agendamentos pendentes: " + e.getMessage());
        }
    }

    /**
     * Endpoint para atualizar status de agendamento (aprovar/rejeitar)
     * PATCH /api/bookings/{id}/status
     * Acessível por administradores e professores
     * @param id ID do agendamento
     * @param updateRequest Dados da atualização
     * @return Agendamento atualizado ou erro
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id,
                                                 @Valid @RequestBody BookingStatusUpdateRequest updateRequest) {
        try {
            BookingResponseDto booking = bookingService.updateBookingStatus(id, updateRequest.getStatus(), updateRequest.getAdminNotes()); // Alterado tipo
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao atualizar agendamento: " + e.getMessage());
        }
    }

    /**
     * Endpoint para cancelar um agendamento
     * PATCH /api/bookings/{id}/cancel
     * @param id ID do agendamento
     * @return Agendamento cancelado ou erro
     */
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            BookingResponseDto booking = bookingService.cancelBooking(id); // Alterado tipo
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao cancelar agendamento: " + e.getMessage());
        }
    }

    /**
     * Endpoint para deletar um agendamento
     * DELETE /api/bookings/{id}
     * @param id ID do agendamento
     * @return Mensagem de sucesso ou erro
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ALTERADO: Apenas ADMIN pode deletar
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok("Agendamento excluído com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao excluir agendamento: " + e.getMessage());
        }
    }

    /**
     * Endpoint para buscar agendamentos em um período específico
     * GET /api/bookings/period
     * @param startDate Data de início (formato: ISO-MM-dd'T'HH:mm:ss)
     * @param endDate Data de fim (formato: ISO-MM-dd'T'HH:mm:ss)
     * @return Lista de agendamentos no período ou erro
     */
    @GetMapping("/period")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getBookingsInPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<BookingResponseDto> bookings = bookingService.getBookingsInPeriod(startDate, endDate); // Alterado tipo
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("Erro ao buscar agendamentos por período: " + e.getMessage());
            return ResponseEntity.badRequest().body("Erro ao buscar agendamentos por período: " + e.getMessage());
        }
    }
}