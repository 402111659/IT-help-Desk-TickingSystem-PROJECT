package com.fatahcode.ticketingsystem.service;

import com.fatahcode.ticketingsystem.entity.DashboardResponse;
import com.fatahcode.ticketingsystem.entity.TechnicianStatisticsResponse;
import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.enums.TicketPriority;
import com.fatahcode.ticketingsystem.enums.TicketStatus;
import com.fatahcode.ticketingsystem.repository.TicketRepository;
import com.fatahcode.ticketingsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public DashboardService(
            TicketRepository ticketRepository,
            UserRepository userRepository) {

        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboardStatistics() {

        long totalUsers =
                userRepository.count();

        long totalEmployees =
                userRepository.countByRole("EMPLOYEE");

        long totalTechnicians =
                userRepository.countByRole("TECHNICIAN");

        long totalAdmins =
                userRepository.countByRole("ADMIN");


        long totalTickets =
                ticketRepository.count();

        long unassignedTickets =
                ticketRepository.countByAssignedTechnicianIsNull();

        long openTickets =
                ticketRepository.countByStatus(TicketStatus.OPEN);

        long inProgressTickets =
                ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);

        long resolvedTickets =
                ticketRepository.countByStatus(TicketStatus.RESOLVED);

        long closedTickets =
                ticketRepository.countByStatus(TicketStatus.CLOSED);


        long lowPriorityTickets =
                ticketRepository.countByPriority(TicketPriority.LOW);

        long mediumPriorityTickets =
                ticketRepository.countByPriority(TicketPriority.MEDIUM);

        long highPriorityTickets =
                ticketRepository.countByPriority(TicketPriority.HIGH);

        long criticalPriorityTickets =
                ticketRepository.countByPriority(TicketPriority.CRITICAL);


        long unresolvedTickets =
                openTickets + inProgressTickets;

        long resolvedOrClosedTickets =
                resolvedTickets + closedTickets;


        return new DashboardResponse(

                totalUsers,
                totalEmployees,
                totalTechnicians,
                totalAdmins,

                totalTickets,
                unassignedTickets,

                openTickets,
                inProgressTickets,
                resolvedTickets,
                closedTickets,

                lowPriorityTickets,
                mediumPriorityTickets,
                highPriorityTickets,
                criticalPriorityTickets,

                unresolvedTickets,
                resolvedOrClosedTickets
        );
    }


    public List<TechnicianStatisticsResponse> getTechnicianStatistics() {

        List<User> technicians =
                userRepository.findByRole("TECHNICIAN");

        return technicians.stream()
                .map(technician -> {

                    long assigned =
                            ticketRepository
                                    .countByAssignedTechnician(technician);

                    long open =
                            ticketRepository
                                    .countByAssignedTechnicianAndStatus(
                                            technician,
                                            TicketStatus.OPEN);

                    long inProgress =
                            ticketRepository
                                    .countByAssignedTechnicianAndStatus(
                                            technician,
                                            TicketStatus.IN_PROGRESS);

                    long resolved =
                            ticketRepository
                                    .countByAssignedTechnicianAndStatus(
                                            technician,
                                            TicketStatus.RESOLVED);

                    long closed =
                            ticketRepository
                                    .countByAssignedTechnicianAndStatus(
                                            technician,
                                            TicketStatus.CLOSED);

                    return new TechnicianStatisticsResponse(
                            technician.getId(),
                            technician.getEmail(),
                            assigned,
                            open,
                            inProgress,
                            resolved,
                            closed
                    );
                })
                .toList();
    }
}