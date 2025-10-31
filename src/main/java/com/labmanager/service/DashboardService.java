// src/main/java/com/labmanager/service/DashboardService.java
package com.labmanager.service;

import com.labmanager.dto.AnalyticsResponseDto;
import com.labmanager.dto.ChartJsDataDto;
import com.labmanager.dto.ChartJsDatasetDto;
import com.labmanager.dto.DashboardStatsResponse;
import com.labmanager.model.Booking;
import com.labmanager.model.BookingStatus;
import com.labmanager.repository.BookingRepository;
import com.labmanager.repository.LaboratoryRepository;
import com.labmanager.repository.PeripheralRepository;
import com.labmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate; // IMPORT ADICIONADO
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter; // IMPORT ADICIONADO
import java.util.List;
import java.util.ArrayList; // IMPORT ADICIONADO
import java.util.LinkedHashMap; // IMPORT ADICIONADO
import java.util.Map; // IMPORT ADICIONADO
// import java.util.stream.Collectors; // Não é usado aqui

/**
 * Serviço do dashboard
 * Responsável por fornecer estatísticas e dados para os dashboards dos usuários
 */
@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LaboratoryRepository laboratoryRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PeripheralRepository peripheralRepository;

    /**
     * Busca estatísticas gerais do sistema para o dashboard administrativo
     * @return Estatísticas completas do sistema
     */
    public DashboardStatsResponse getAdminStats() {
        long totalUsers = userRepository.countByActiveTrue();
        long totalLaboratories = laboratoryRepository.countByActiveTrue();
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long approvedBookings = bookingRepository.countByStatus(BookingStatus.APPROVED);
        long rejectedBookings = bookingRepository.countByStatus(BookingStatus.REJECTED);
        long totalPeripherals = peripheralRepository.countByActiveTrue();

        return new DashboardStatsResponse(totalUsers, totalLaboratories, totalBookings,
                pendingBookings, approvedBookings, rejectedBookings, totalPeripherals);
    }

    /**
     * Busca estatísticas básicas para usuários não-admin
     * @return Estatísticas limitadas
     */
    public DashboardStatsResponse getBasicStats() {
        long totalLaboratories = laboratoryRepository.countByActiveTrue();
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long approvedBookings = bookingRepository.countByStatus(BookingStatus.APPROVED);

        return new DashboardStatsResponse(0, totalLaboratories, totalBookings,
                pendingBookings, approvedBookings, 0, 0);
    }

    /**
     * Busca atividades recentes do sistema (últimos 7 dias)
     * @return Lista de agendamentos recentes
     */
    public List<Booking> getRecentActivities() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return bookingRepository.findRecentBookings(sevenDaysAgo);
    }

    /**
     * Busca próximos agendamentos aprovados (próximos 7 dias)
     * @return Lista de agendamentos futuros
     */
    public List<Booking> getUpcomingBookings() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysFromNow = now.plusDays(7);
        return bookingRepository.findUpcomingBookings(now, sevenDaysFromNow);
    }


    // --- NOVOS MÉTODOS PARA ANALYTICS (GRÁFICOS) ---

    /**
     * Busca e formata todos os dados analíticos para o dashboard do admin.
     * @return DTO contendo os dados dos gráficos.
     */
    public AnalyticsResponseDto getAdminAnalytics() {
        ChartJsDataDto bookingsOverTime = getBookingsOverTimeData();
        ChartJsDataDto labPopularity = getLabPopularityData();

        return new AnalyticsResponseDto(bookingsOverTime, labPopularity);
    }

    /**
     * Prepara os dados para o gráfico de Agendamentos ao Longo do Tempo (Últimos 7 dias).
     */
    private ChartJsDataDto getBookingsOverTimeData() {
        // 1. Define o período (últimos 7 dias, incluindo hoje)
        LocalDateTime startDate = LocalDateTime.now().minusDays(6).withHour(0).withMinute(0).withSecond(0);
        
        // 2. Cria um mapa com todos os dias (labels) e contagens zeradas
        // Usamos LinkedHashMap para manter a ordem de inserção (datas)
        Map<String, Long> approvedMap = new LinkedHashMap<>();
        Map<String, Long> pendingMap = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM"); // Formato "24/10"

        for (int i = 0; i < 7; i++) {
            // Itera de 6 dias atrás até hoje
            String dayLabel = LocalDate.now().minusDays(6 - i).format(formatter);
            approvedMap.put(dayLabel, 0L);
            pendingMap.put(dayLabel, 0L);
        }

        // 3. Busca os dados do banco
        List<Object[]> approvedResults = bookingRepository.findBookingsPerDayByStatus(BookingStatus.APPROVED, startDate);
        List<Object[]> pendingResults = bookingRepository.findBookingsPerDayByStatus(BookingStatus.PENDING, startDate);

        // 4. Preenche os mapas com os dados do banco
        // O HQL/JPA pode retornar java.sql.Date, que precisa ser convertido para LocalDate
        DateTimeFormatter dbDateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        approvedResults.forEach(row -> {
            // Converte o objeto de data retornado (pode ser Date, Timestamp, etc.) para String e depois para LocalDate
            LocalDate date = LocalDate.parse(row[0].toString(), dbDateFormatter);
            String dayLabel = date.format(formatter);
            Long count = (Long) row[1];
            if (approvedMap.containsKey(dayLabel)) {
                approvedMap.put(dayLabel, count);
            }
        });

        pendingResults.forEach(row -> {
            LocalDate date = LocalDate.parse(row[0].toString(), dbDateFormatter);
            String dayLabel = date.format(formatter);
            Long count = (Long) row[1];
            if (pendingMap.containsKey(dayLabel)) {
                pendingMap.put(dayLabel, count);
            }
        });

        // 5. Constrói os DTOs para o Chart.js
        List<String> labels = new ArrayList<>(approvedMap.keySet());
        
        ChartJsDatasetDto approvedDataset = new ChartJsDatasetDto("Aprovados", new ArrayList<>(approvedMap.values()));
        ChartJsDatasetDto pendingDataset = new ChartJsDatasetDto("Pendentes", new ArrayList<>(pendingMap.values()));

        return new ChartJsDataDto(labels, List.of(approvedDataset, pendingDataset));
    }

    /**
     * Prepara os dados para o gráfico de Popularidade do Laboratório (Últimos 30 dias).
     */
    private ChartJsDataDto getLabPopularityData() {
        // 1. Define o período
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);

        // 2. Busca os dados
        List<Object[]> results = bookingRepository.findLabPopularity(startDate);

        // 3. Processa os resultados
        List<String> labels = new ArrayList<>();
        List<Long> data = new ArrayList<>();

        results.forEach(row -> {
            labels.add((String) row[0]); // Nome do Lab (String)
            data.add((Long) row[1]);   // Contagem (Long)
        });
        
        // 4. Constrói os DTOs
        ChartJsDatasetDto dataset = new ChartJsDatasetDto("Agendamentos Aprovados (30d)", data);

        return new ChartJsDataDto(labels, List.of(dataset));
    }
}