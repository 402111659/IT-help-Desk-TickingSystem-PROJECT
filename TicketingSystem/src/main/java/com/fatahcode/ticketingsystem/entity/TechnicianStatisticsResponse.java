package com.fatahcode.ticketingsystem.entity;

public class TechnicianStatisticsResponse {

    private Long technicianId;
    private String email;

    private long assignedTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;

    public TechnicianStatisticsResponse() {
    }

    public TechnicianStatisticsResponse(
            Long technicianId,
            String email,
            long assignedTickets,
            long openTickets,
            long inProgressTickets,
            long resolvedTickets,
            long closedTickets) {

        this.technicianId = technicianId;
        this.email = email;
        this.assignedTickets = assignedTickets;
        this.openTickets = openTickets;
        this.inProgressTickets = inProgressTickets;
        this.resolvedTickets = resolvedTickets;
        this.closedTickets = closedTickets;
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public String getEmail() {
        return email;
    }

    public long getAssignedTickets() {
        return assignedTickets;
    }

    public long getOpenTickets() {
        return openTickets;
    }

    public long getInProgressTickets() {
        return inProgressTickets;
    }

    public long getResolvedTickets() {
        return resolvedTickets;
    }

    public long getClosedTickets() {
        return closedTickets;
    }
}