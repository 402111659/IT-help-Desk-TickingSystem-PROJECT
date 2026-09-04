package com.fatahcode.ticketingsystem.service;
import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.repository.UserRepository;
import com.fatahcode.ticketingsystem.entity.Ticket;
import com.fatahcode.ticketingsystem.repository.TicketRepository;
import org.springframework.stereotype.Service;
import com.fatahcode.ticketingsystem.enums.TicketStatus;
import com.fatahcode.ticketingsystem.exception.InvalidStatusTransitionException;
import com.fatahcode.ticketingsystem.enums.TicketPriority;
import java.time.LocalDateTime;
import java.util.List;
import com.fatahcode.ticketingsystem.exception.UnauthorizedTicketActionException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.fatahcode.ticketingsystem.exception.ResourceNotFoundException;

@Service
public class TicketService {

    private final NotificationService notificationService;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;


    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository,
            NotificationService notificationService) {

        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    private String generateTicketNumber() {

        long count = ticketRepository.count() + 1;

        int year = LocalDateTime.now().getYear();

        return String.format("TKT-%d-%03d", year, count);
    }



    public Ticket createTicket(Ticket ticket, User user) {

        ticket.setTicketNumber(generateTicketNumber());

        ticket.setCreatedBy(user);

        // Every new ticket must start as OPEN
        ticket.setStatus(TicketStatus.OPEN);

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }


    public Ticket getTicketById(Long id, User user) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket not found"));

        String role = user.getRole();

        boolean allowed = false;

        if ("ADMIN".equals(role)) {

            allowed = true;

        } else if ("EMPLOYEE".equals(role)) {

            if (ticket.getCreatedBy() != null &&
                    ticket.getCreatedBy().getId().equals(user.getId())) {

                allowed = true;
            }

        } else if ("TECHNICIAN".equals(role)) {

            if (ticket.getAssignedTechnician() != null &&
                    ticket.getAssignedTechnician().getId().equals(user.getId())) {

                allowed = true;
            }
        }

        if (!allowed) {

            throw new UnauthorizedTicketActionException(
                    "You are not allowed to view this ticket"
            );
        }

        return ticket;
    }


    public Ticket updateTicket(Long id, Ticket updatedTicket) {

        Ticket existingTicket = ticketRepository.findById(id)
                .orElse(null);

        if (existingTicket == null) {
            return null;
        }

        existingTicket.setTitle(updatedTicket.getTitle());
        existingTicket.setDescription(updatedTicket.getDescription());
        existingTicket.setPriority(updatedTicket.getPriority());

        return ticketRepository.save(existingTicket);
    }


    public Ticket assignTechnician(Long ticketId, Long technicianId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket not found"));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (!"TECHNICIAN".equals(technician.getRole())) {
            throw new ResourceNotFoundException(
                    "User is not a technician"
            );
        }

        ticket.setAssignedTechnician(technician);

        Ticket savedTicket = ticketRepository.save(ticket);

        notificationService.createNotification(
                technician,
                "You have been assigned Ticket #" +
                        savedTicket.getTicketNumber()
        );

        return savedTicket;
    }


    public List<Ticket> getTicketsAssignedToTechnician(User technician) {

        return ticketRepository.findByAssignedTechnician(technician);
    }



    public List<Ticket> getTicketsCreatedByUser(User user) {

        return ticketRepository.findByCreatedBy(user);
    }


    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }


    public Ticket updateTicketStatus(Long id, TicketStatus newStatus) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ticket not found"));

        TicketStatus currentStatus = ticket.getStatus();

        if (currentStatus == TicketStatus.OPEN
                && newStatus != TicketStatus.IN_PROGRESS) {

            throw new InvalidStatusTransitionException(
                    "An OPEN ticket can only move to IN_PROGRESS"
            );
        }

        if (currentStatus == TicketStatus.IN_PROGRESS
                && newStatus != TicketStatus.RESOLVED) {

            throw new InvalidStatusTransitionException(
                    "An IN_PROGRESS ticket can only move to RESOLVED"
            );
        }

        if (currentStatus == TicketStatus.RESOLVED
                && newStatus != TicketStatus.CLOSED) {

            throw new InvalidStatusTransitionException(
                    "A RESOLVED ticket can only move to CLOSED"
            );
        }

        if (currentStatus == TicketStatus.CLOSED) {

            throw new InvalidStatusTransitionException(
                    "A CLOSED ticket cannot be changed"
            );
        }

        ticket.setStatus(newStatus);

        Ticket savedTicket = ticketRepository.save(ticket);

        if (savedTicket.getCreatedBy() != null) {

            notificationService.createNotification(
                    savedTicket.getCreatedBy(),
                    "Your ticket " +
                            savedTicket.getTicketNumber() +
                            " has been moved to " +
                            newStatus
            );
        }

        return savedTicket;
    }


    public Ticket updateTicketPriority(Long id, TicketPriority priority) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        ticket.setPriority(priority);

        Ticket savedTicket = ticketRepository.save(ticket);

        if (savedTicket.getCreatedBy() != null) {

            notificationService.createNotification(
                    savedTicket.getCreatedBy(),
                    "The priority of your ticket " +
                            savedTicket.getTicketNumber() +
                            " has been changed to " +
                            priority
            );
        }

        return savedTicket;
    }

    public Page<Ticket> searchTickets(
            TicketStatus status,
            TicketPriority priority,
            Long technicianId,
            Long createdById,
            Pageable pageable) {

        if (status != null && priority != null) {

            return ticketRepository
                    .findByStatusAndPriority(
                            status,
                            priority,
                            pageable);
        }

        if (status != null) {

            return ticketRepository
                    .findByStatus(status, pageable);
        }

        if (priority != null) {

            return ticketRepository
                    .findByPriority(priority, pageable);
        }

        if (technicianId != null) {

            User technician = userRepository.findById(technicianId)
                    .orElseThrow(() ->
                            new RuntimeException("Technician not found"));

            return ticketRepository
                    .findByAssignedTechnician(
                            technician,
                            pageable);
        }

        if (createdById != null) {

            User employee = userRepository.findById(createdById)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("User not found"));

            return ticketRepository
                    .findByCreatedBy(
                            employee,
                            pageable);
        }

        return ticketRepository.findAll(pageable);
    }









}