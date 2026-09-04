package com.fatahcode.ticketingsystem.repository;

import com.fatahcode.ticketingsystem.entity.Ticket;
import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.enums.TicketPriority;
import com.fatahcode.ticketingsystem.enums.TicketStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TicketRepository
        extends JpaRepository<Ticket, Long> {


    // =====================================================
    // ASSIGNMENT
    // =====================================================

    long countByAssignedTechnicianIsNull();

    List<Ticket> findByAssignedTechnician(
            User technician
    );

    long countByAssignedTechnician(
            User technician
    );

    long countByAssignedTechnicianAndStatus(
            User technician,
            TicketStatus status
    );


    // =====================================================
    // CREATED BY USER
    // =====================================================

    List<Ticket> findByCreatedBy(
            User user
    );


    // =====================================================
    // STATUS
    // =====================================================

    long countByStatus(
            TicketStatus status
    );

    List<Ticket> findByStatus(
            TicketStatus status
    );


    // =====================================================
    // PRIORITY
    // =====================================================

    long countByPriority(
            TicketPriority priority
    );

    List<Ticket> findByPriority(
            TicketPriority priority
    );


    // =====================================================
    // STATUS + PRIORITY
    // =====================================================

    List<Ticket> findByStatusAndPriority(
            TicketStatus status,
            TicketPriority priority
    );


    // =====================================================
    // PAGINATED SEARCH
    // =====================================================

    Page<Ticket> findByStatus(
            TicketStatus status,
            Pageable pageable
    );

    Page<Ticket> findByPriority(
            TicketPriority priority,
            Pageable pageable
    );

    Page<Ticket> findByStatusAndPriority(
            TicketStatus status,
            TicketPriority priority,
            Pageable pageable
    );

    Page<Ticket> findByAssignedTechnician(
            User technician,
            Pageable pageable
    );

    Page<Ticket> findByCreatedBy(
            User user,
            Pageable pageable
    );

}