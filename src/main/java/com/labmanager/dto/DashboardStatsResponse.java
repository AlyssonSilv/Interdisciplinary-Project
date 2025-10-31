package com.labmanager.dto;

/**
 * DTO para resposta das estatísticas do dashboard
 * Contém contadores e métricas do sistema
 */
public class DashboardStatsResponse {
    
    private long totalUsers;
    private long totalLaboratories;
    private long totalBookings;
    private long pendingBookings;
    private long approvedBookings;
    private long rejectedBookings;
    private long totalPeripherals;
    
    // Construtores
    public DashboardStatsResponse() {}
    
    public DashboardStatsResponse(long totalUsers, long totalLaboratories, long totalBookings,
                                long pendingBookings, long approvedBookings, long rejectedBookings,
                                long totalPeripherals) {
        this.totalUsers = totalUsers;
        this.totalLaboratories = totalLaboratories;
        this.totalBookings = totalBookings;
        this.pendingBookings = pendingBookings;
        this.approvedBookings = approvedBookings;
        this.rejectedBookings = rejectedBookings;
        this.totalPeripherals = totalPeripherals;
    }
    
    // Getters e Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    
    public long getTotalLaboratories() { return totalLaboratories; }
    public void setTotalLaboratories(long totalLaboratories) { this.totalLaboratories = totalLaboratories; }
    
    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }
    
    public long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; }
    
    public long getApprovedBookings() { return approvedBookings; }
    public void setApprovedBookings(long approvedBookings) { this.approvedBookings = approvedBookings; }
    
    public long getRejectedBookings() { return rejectedBookings; }
    public void setRejectedBookings(long rejectedBookings) { this.rejectedBookings = rejectedBookings; }
    
    public long getTotalPeripherals() { return totalPeripherals; }
    public void setTotalPeripherals(long totalPeripherals) { this.totalPeripherals = totalPeripherals; }
}
