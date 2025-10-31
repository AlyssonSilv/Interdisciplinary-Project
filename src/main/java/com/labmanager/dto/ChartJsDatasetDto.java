package com.labmanager.dto;

import java.util.List;

/**
 * DTO para um "dataset" dentro do Chart.js.
 * Contém a legenda (label) e os pontos de dados.
 */
public class ChartJsDatasetDto {
    
    private String label;
    private List<Long> data;
    
    // Adicione cores se quiser controlar pelo backend
    // private String backgroundColor;
    // private String borderColor;

    public ChartJsDatasetDto(String label, List<Long> data) {
        this.label = label;
        this.data = data;
    }

    // Getters e Setters
    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<Long> getData() {
        return data;
    }

    public void setData(List<Long> data) {
        this.data = data;
    }
}