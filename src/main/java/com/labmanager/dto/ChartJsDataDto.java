package com.labmanager.dto;

import java.util.List;

/**
 * DTO genérico para os dados de um gráfico Chart.js.
 */
public class ChartJsDataDto {
    
    private List<String> labels;
    private List<ChartJsDatasetDto> datasets;

    public ChartJsDataDto(List<String> labels, List<ChartJsDatasetDto> datasets) {
        this.labels = labels;
        this.datasets = datasets;
    }

    // Getters e Setters
    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<ChartJsDatasetDto> getDatasets() {
        return datasets;
    }

    public void setDatasets(List<ChartJsDatasetDto> datasets) {
        this.datasets = datasets;
    }
}