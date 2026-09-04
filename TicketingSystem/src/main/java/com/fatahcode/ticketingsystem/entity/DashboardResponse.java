package com.fatahcode.ticketingsystem.entity;

public class DashboardResponse {

    private long unassignedTickets;
    private long totalUsers;
    private long totalEmployees;
    private long totalTechnicians;
    private long totalAdmins;

    private long unresolvedTickets;
    private long resolvedOrClosedTickets;

    private long totalTickets;

    private long openTickets;

    private long inProgressTickets;

    private long resolvedTickets;

    private long closedTickets;

    private long lowPriorityTickets;

    private long mediumPriorityTickets;

    private long highPriorityTickets;

    private long criticalPriorityTickets;

    public DashboardResponse() {
    }

    public DashboardResponse(

            long unassignedTickets,
            long totalUsers,
            long totalEmployees,
            long totalTechnicians,
            long totalAdmins,

            long totalTickets,
            long openTickets,
            long inProgressTickets,
            long resolvedTickets,
            long closedTickets,

            long lowPriorityTickets,
            long mediumPriorityTickets,
            long highPriorityTickets,
            long criticalPriorityTickets,

            long unresolvedTickets,
            long resolvedOrClosedTickets) {
        this.unassignedTickets = unassignedTickets;
        this.totalUsers = totalUsers;
        this.totalEmployees = totalEmployees;
        this.totalTechnicians = totalTechnicians;
        this.totalAdmins = totalAdmins;

        this.totalTickets = totalTickets;
        this.openTickets = openTickets;
        this.inProgressTickets = inProgressTickets;
        this.resolvedTickets = resolvedTickets;
        this.closedTickets = closedTickets;

        this.lowPriorityTickets = lowPriorityTickets;
        this.mediumPriorityTickets = mediumPriorityTickets;
        this.highPriorityTickets = highPriorityTickets;
        this.criticalPriorityTickets = criticalPriorityTickets;

        this.unresolvedTickets = unresolvedTickets;
        this.resolvedOrClosedTickets = resolvedOrClosedTickets;
    }

    public long getTotalTickets() {
        return totalTickets;
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

    public long getLowPriorityTickets() {
        return lowPriorityTickets;
    }

    public long getMediumPriorityTickets() {
        return mediumPriorityTickets;
    }

    public long getHighPriorityTickets() {
        return highPriorityTickets;
    }

    public long getCriticalPriorityTickets() {
        return criticalPriorityTickets;
    }



    public long getUnresolvedTickets() {
        return unresolvedTickets;
    }

    public long getResolvedOrClosedTickets() {
        return resolvedOrClosedTickets;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public long getTotalTechnicians() {
        return totalTechnicians;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }


    public long getUnassignedTickets() {
        return unassignedTickets;
    }
}