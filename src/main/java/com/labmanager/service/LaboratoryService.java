package com.labmanager.service;

import com.labmanager.model.Laboratory;
import com.labmanager.model.Peripheral;
import com.labmanager.repository.LaboratoryRepository;
import com.labmanager.repository.PeripheralRepository;
import com.labmanager.repository.BookingRepository;
import com.labmanager.model.Booking;
import com.labmanager.model.BookingStatus; // Import não estava no original

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
// import java.time.temporal.ChronoUnit; // Não é mais usado
import java.util.ArrayList;
import java.util.List;
// import java.util.stream.Collectors; // Não é mais usado

/**
 * Serviço de laboratórios
 * Responsável por operações relacionadas aos laboratórios e seus periféricos
 */
@Service
public class LaboratoryService {

    @Autowired
    private LaboratoryRepository laboratoryRepository;

    @Autowired
    private PeripheralRepository peripheralRepository;

    @Autowired
    private BookingRepository bookingRepository; // Injeção do BookingRepository para a lógica de slots

    /**
     * Busca todos os laboratórios ativos
     * @return Lista de laboratórios ativos
     */
    public List<Laboratory> getAllLaboratories() {
        return laboratoryRepository.findByActiveTrue();
    }

    /**
     * Busca laboratórios disponíveis em um período específico
     * @param startTime Data/hora de início
     * @param endTime Data/hora de fim
     * @return Lista de laboratórios disponíveis
     */
    public List<Laboratory> getAvailableLaboratories(LocalDateTime startTime, LocalDateTime endTime) {
        return laboratoryRepository.findAvailableLaboratories(startTime, endTime);
    }

    /**
     * Busca um laboratório por ID
     * @param id ID do laboratório
     * @return Laboratório encontrado
     */
    public Laboratory getLaboratoryById(Long id) {
        return laboratoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Laboratório não encontrado"));
    }

    /**
     * Cria um novo laboratório
     * Apenas administradores podem executar esta operação
     * @param laboratory Dados do laboratório
     * @return Laboratório criado
     */
    @Transactional
    public Laboratory createLaboratory(Laboratory laboratory) {
        return laboratoryRepository.save(laboratory);
    }

    /**
     * Atualiza um laboratório existente
     * @param id ID do laboratório
     * @param laboratoryDetails Novos dados do laboratório
     * @return Laboratório atualizado
     */
    @Transactional
    public Laboratory updateLaboratory(Long id, Laboratory laboratoryDetails) {
        Laboratory laboratory = getLaboratoryById(id);
        
        laboratory.setName(laboratoryDetails.getName());
        laboratory.setDescription(laboratoryDetails.getDescription());
        laboratory.setCapacity(laboratoryDetails.getCapacity());
        laboratory.setLocation(laboratoryDetails.getLocation());
        
        return laboratoryRepository.save(laboratory);
    }

    /**
     * Desativa um laboratório (soft delete)
     * @param id ID do laboratório
     */
    @Transactional
    public void deleteLaboratory(Long id) {
        Laboratory laboratory = getLaboratoryById(id);
        laboratory.setActive(false);
        laboratoryRepository.save(laboratory);
    }

    /**
     * Busca periféricos de um laboratório específico
     * @param laboratoryId ID do laboratório
     * @return Lista de periféricos do laboratório
     */
    public List<Peripheral> getLaboratoryPeripherals(Long laboratoryId) {
        return peripheralRepository.findByLaboratoryIdAndActiveTrue(laboratoryId);
    }

    /**
     * Adiciona um periférico a um laboratório
     * @param laboratoryId ID do laboratório
     * @param peripheral Dados do periférico
     * @return Periférico criado
     */
    @Transactional
    public Peripheral addPeripheralToLaboratory(Long laboratoryId, Peripheral peripheral) {
        Laboratory laboratory = getLaboratoryById(laboratoryId);
        peripheral.setLaboratory(laboratory);
        return peripheralRepository.save(peripheral);
    }

    /**
     * Atualiza um periférico
     * @param peripheralId ID do periférico
     * @param peripheralDetails Novos dados do periférico
     * @return Periférico atualizado
     */
    @Transactional
    public Peripheral updatePeripheral(Long peripheralId, Peripheral peripheralDetails) {
        Peripheral peripheral = peripheralRepository.findById(peripheralId)
                .orElseThrow(() -> new RuntimeException("Periférico não encontrado"));
        
        peripheral.setName(peripheralDetails.getName());
        peripheral.setDescription(peripheralDetails.getDescription());
        peripheral.setQuantity(peripheralDetails.getQuantity());
        
        return peripheralRepository.save(peripheral);
    }

    /**
     * Remove um periférico (soft delete)
     * @param peripheralId ID do periférico
     */
    @Transactional
    public void deletePeripheral(Long peripheralId) {
        Peripheral peripheral = peripheralRepository.findById(peripheralId)
                .orElseThrow(() -> new RuntimeException("Periférico não encontrado"));
        peripheral.setActive(false);
        peripheralRepository.save(peripheral);
    }

    /**
     * Calcula e retorna uma lista de slots de tempo disponíveis para um laboratório específico em uma dada data.
     * Assume slots de 1 hora, das 08:00 às 22:00, de segunda a sexta.
     * @param laboratoryId ID do laboratório
     * @param date Data para verificar a disponibilidade
     * @return Lista de strings representando os slots disponíveis (ex: "HH:MM - HH:MM")
     */
    public List<String> getAvailableTimeSlotsForLab(Long laboratoryId, LocalDate date) {
        // Obtenha o laboratório para verificar se está ativo
        Laboratory laboratory = getLaboratoryById(laboratoryId);

        if (!laboratory.getActive()) {
            return new ArrayList<>();
        }

        // Definir os horários de funcionamento padrão do laboratório
        LocalTime dayStartTime = LocalTime.of(8, 0); // 08:00
        LocalTime dayEndTime = LocalTime.of(22, 0); // 22:00

        // Exemplo: laboratório fechado nos fins de semana (ajuste conforme suas regras de negócio)
        if (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
             return new ArrayList<>(); // Nenhum slot disponível
        }

        // Gerar todos os slots potenciais de 1 hora para o dia
        List<LocalDateTime> potentialSlotsStartTimes = new ArrayList<>();
        LocalDateTime currentSlotStart = LocalDateTime.of(date, dayStartTime);
        while (!currentSlotStart.toLocalTime().isAfter(dayEndTime.minusHours(1))) {
            potentialSlotsStartTimes.add(currentSlotStart);
            currentSlotStart = currentSlotStart.plusHours(1);
        }

        // --- INÍCIO DA CORREÇÃO ---
        
        // Buscar todos os agendamentos APROVADOS para este laboratório nesta data
        // Precisamos calcular o início e o fim do dia como LocalDateTime
        LocalDateTime startOfDayCheck = date.atStartOfDay(); // Ex: 2025-10-24T00:00:00
        LocalDateTime endOfDayCheck = date.plusDays(1).atStartOfDay(); // Ex: 2025-10-25T00:00:00 (início do próximo dia)

        // Chama o novo método que criamos no BookingRepository
        List<Booking> approvedBookings = bookingRepository.findApprovedBookingsForLabInTimeRange(
                laboratoryId,
                startOfDayCheck,
                endOfDayCheck
        );
        
        // --- FIM DA CORREÇÃO ---

        // Filtrar slots que se sobrepõem com agendamentos aprovados ou que já passaram
        List<String> availableSlots = new ArrayList<>();
        for (LocalDateTime slotStart : potentialSlotsStartTimes) {
            LocalDateTime slotEnd = slotStart.plusHours(1); // Assume slots de 1 hora
            boolean isConflict = false;

            // Verifica se o slot potencial já passou (não pode agendar no passado)
            // Adiciona uma margem (ex: 1 minuto) para evitar agendar em cima da hora
            if (slotStart.isBefore(LocalDateTime.now().minusMinutes(1))) { 
                isConflict = true;
            } else {
                for (Booking booking : approvedBookings) {
                    // Verifica sobreposição de tempo:
                    // (SlotStart < BookingEnd) E (SlotEnd > BookingStart)
                    if (slotStart.isBefore(booking.getEndTime()) && slotEnd.isAfter(booking.getStartTime())) {
                        isConflict = true;
                        break;
                    }
                }
            }

            if (!isConflict) {
                availableSlots.add(slotStart.toLocalTime().toString() + " - " + slotEnd.toLocalTime().toString());
            }
        }

        return availableSlots;
    }
}