package com.labmanager.dto;

/**
 * DTO principal para a resposta de dados analíticos do dashboard admin.
 * Contém os dados formatados para os gráficos.
 */
public class AnalyticsResponseDto {

    private ChartJsDataDto bookingsOverTime;
    private ChartJsDataDto labPopularity;

    public AnalyticsResponseDto(ChartJsDataDto bookingsOverTime, ChartJsDataDto labPopularity) {
        this.bookingsOverTime = bookingsOverTime;
        this.labPopularity = labPopularity;
    }

    // Getters e Setters
    public ChartJsDataDto getBookingsOverTime() {
        return bookingsOverTime;
    }

    public void setBookingsOverTime(ChartJsDataDto bookingsOverTime) {
        this.bookingsOverTime = bookingsOverTime;
    }

    public ChartJsDataDto getLabPopularity() {
        return labPopularity;
    }

    public void setLabPopularity(ChartJsDataDto labPopularity) {
        this.labPopularity = labPopularity;
    }
}