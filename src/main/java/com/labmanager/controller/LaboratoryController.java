package com.labmanager.controller;

import com.labmanager.model.Laboratory;
import com.labmanager.model.Peripheral;
import com.labmanager.service.LaboratoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Controlador de laboratórios
 * Endpoints: /api/laboratories/*
 * Responsável por operações relacionadas aos laboratórios e periféricos
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/laboratories")
public class LaboratoryController {

    @Autowired
    private LaboratoryService laboratoryService;

    /**
     * Endpoint para buscar todos os laboratórios
     * GET /api/laboratories
     * @return Lista de laboratórios ativos
     */
    @GetMapping
    public ResponseEntity<List<Laboratory>> getAllLaboratories() {
        try {
            List<Laboratory> laboratories = laboratoryService.getAllLaboratories();
            return ResponseEntity.ok(laboratories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Endpoint para buscar laboratórios disponíveis em um período
     * GET /api/laboratories/available
     * @param startTime Data/hora de início
     * @param endTime Data/hora de fim
     * @return Lista de laboratórios disponíveis
     */
    @GetMapping("/available")
    public ResponseEntity<List<Laboratory>> getAvailableLaboratories(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<Laboratory> laboratories = laboratoryService.getAvailableLaboratories(startTime, endTime);
            return ResponseEntity.ok(laboratories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * NOVO ENDPOINT: Endpoint para buscar slots de tempo disponíveis para um laboratório específico em uma dada data
     * GET /api/laboratories/{id}/available-slots?date=YYYY-MM-DD
     * @param id ID do laboratório
     * @param date Data para verificar slots
     * @return Lista de strings representando os slots disponíveis (ex: "08:00 - 09:00")
     */
    @GetMapping("/{id}/available-slots")
    @PreAuthorize("isAuthenticated()") // Qualquer usuário autenticado pode ver os slots
    public ResponseEntity<?> getAvailableTimeSlots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) { // A data será YYYY-MM-DD
        try {
            List<String> slots = laboratoryService.getAvailableTimeSlotsForLab(id, date);
            return ResponseEntity.ok(slots);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Erro ao buscar slots: " + e.getMessage());
        }
    }


    /**
     * Endpoint para buscar um laboratório específico
     * GET /api/laboratories/{id}
     * @param id ID do laboratório
     * @return Dados do laboratório
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getLaboratoryById(@PathVariable Long id) {
        try {
            Laboratory laboratory = laboratoryService.getLaboratoryById(id);
            return ResponseEntity.ok(laboratory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao buscar laboratório: " + e.getMessage());
        }
    }

    /**
     * Endpoint para criar um novo laboratório
     * POST /api/laboratories
     * Apenas administradores podem executar
     * @param laboratory Dados do laboratório
     * @return Laboratório criado
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createLaboratory(@Valid @RequestBody Laboratory laboratory) {
        try {
            Laboratory createdLaboratory = laboratoryService.createLaboratory(laboratory);
            return ResponseEntity.ok(createdLaboratory);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao criar laboratório: " + e.getMessage());
        }
    }

    /**
     * Endpoint para atualizar um laboratório
     * PUT /api/laboratories/{id}
     * Apenas administradores podem executar
     * @param id ID do laboratório
     * @param laboratory Novos dados do laboratório
     * @return Laboratório atualizado
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateLaboratory(@PathVariable Long id, 
                                            @Valid @RequestBody Laboratory laboratory) {
        try {
            Laboratory updatedLaboratory = laboratoryService.updateLaboratory(id, laboratory);
            return ResponseEntity.ok(updatedLaboratory);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao atualizar laboratório: " + e.getMessage());
        }
    }

    /**
     * Endpoint para deletar um laboratório
     * DELETE /api/laboratories/{id}
     * Apenas administradores podem executar
     * @param id ID do laboratório
     * @return Mensagem de sucesso
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteLaboratory(@PathVariable Long id) {
        try {
            laboratoryService.deleteLaboratory(id);
            return ResponseEntity.ok("Laboratório removido com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao remover laboratório: " + e.getMessage());
        }
    }

    /**
     * Endpoint para buscar periféricos de um laboratório
     * GET /api/laboratories/{id}/peripherals
     * @param id ID do laboratório
     * @return Lista de periféricos do laboratório
     */
    @GetMapping("/{id}/peripherals")
    public ResponseEntity<List<Peripheral>> getLaboratoryPeripherals(@PathVariable Long id) {
        try {
            List<Peripheral> peripherals = laboratoryService.getLaboratoryPeripherals(id);
            return ResponseEntity.ok(peripherals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Endpoint para adicionar periférico a um laboratório
     * POST /api/laboratories/{id}/peripherals
     * Apenas administradores podem executar
     * @param id ID do laboratório
     * @param peripheral Dados do periférico
     * @return Periférico criado
     */
    @PostMapping("/{id}/peripherals")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addPeripheralToLaboratory(@PathVariable Long id, 
                                                     @Valid @RequestBody Peripheral peripheral) {
        try {
            Peripheral createdPeripheral = laboratoryService.addPeripheralToLaboratory(id, peripheral);
            return ResponseEntity.ok(createdPeripheral);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao adicionar periférico: " + e.getMessage());
        }
    }

    /**
     * Endpoint para atualizar um periférico
     * PUT /api/laboratories/peripherals/{peripheralId}
     * Apenas administradores podem executar
     * @param peripheralId ID do periférico
     * @param peripheral Novos dados do periférico
     * @return Periférico atualizado
     */
    @PutMapping("/peripherals/{peripheralId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePeripheral(@PathVariable Long peripheralId, 
                                            @Valid @RequestBody Peripheral peripheral) {
        try {
            Peripheral updatedPeripheral = laboratoryService.updatePeripheral(peripheralId, peripheral);
            return ResponseEntity.ok(updatedPeripheral);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao atualizar periférico: " + e.getMessage());
        }
    }

    /**
     * Endpoint para deletar um periférico
     * DELETE /api/laboratories/peripherals/{peripheralId}
     * Apenas administradores podem executar
     * @param peripheralId ID do periférico
     * @return Mensagem de sucesso
     */
    @DeleteMapping("/peripherals/{peripheralId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePeripheral(@PathVariable Long peripheralId) {
        try {
            laboratoryService.deletePeripheral(peripheralId);
            return ResponseEntity.ok("Periférico removido com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao remover periférico: " + e.getMessage());
        }
    }
}