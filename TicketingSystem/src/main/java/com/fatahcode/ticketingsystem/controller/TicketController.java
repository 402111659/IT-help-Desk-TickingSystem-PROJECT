package com.fatahcode.ticketingsystem.controller;
import org.springframework.security.core.Authentication;
import com.fatahcode.ticketingsystem.entity.Ticket;
import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.service.TicketService;
import com.fatahcode.ticketingsystem.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.fatahcode.ticketingsystem.enums.TicketStatus;
import com.fatahcode.ticketingsystem.enums.TicketPriority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import java.util.List;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;


@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UserService userService;

    public TicketController(
            TicketService ticketService,
            UserService userService) {

        this.ticketService = ticketService;
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @PreAuthorize("hasAnyRole('EMPLOYEE', 'TECHNICIAN', 'ADMIN')")
    @PostMapping
    public Ticket createTicket(
            @RequestBody Ticket ticket,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return ticketService.createTicket(ticket, user);
    }



    @PreAuthorize("hasRole('TECHNICIAN')")
    @GetMapping("/assigned")
    public List<Ticket> getMyAssignedTickets(Authentication authentication) {

        String email = authentication.getName();

        User technician = userService.findByEmail(email);

        return ticketService.getTicketsAssignedToTechnician(technician);
    }




    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/my-tickets")
    public List<Ticket> getMyTickets(Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return ticketService.getTicketsCreatedByUser(user);
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return ticketService.getTicketById(id, user);
    }




    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    @PutMapping("/{id}")
    public Ticket updateTicket(
            @PathVariable Long id,
            @RequestBody Ticket ticket) {

        System.out.println("UPDATE TICKET ENDPOINT REACHED");

        return ticketService.updateTicket(id, ticket);
    }



    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{ticketId}/assign/{technicianId}")
    public Ticket assignTechnician(
            @PathVariable Long ticketId,
            @PathVariable Long technicianId) {

        return ticketService.assignTechnician(ticketId, technicianId);
    }


    @PutMapping("/{id}/status")
    public Ticket updateTicketStatus(
            @PathVariable Long id,
            @RequestBody TicketStatus status) {

        return ticketService.updateTicketStatus(id, status);
    }



    @PreAuthorize("hasAnyRole('TECHNICIAN', 'ADMIN')")
    @PutMapping("/{id}/priority")
    public Ticket updateTicketPriority(
            @PathVariable Long id,
            @RequestBody TicketPriority priority) {

        return ticketService.updateTicketPriority(id, priority);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public Page<Ticket> searchTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) Long technicianId,
            @RequestParam(required = false) Long createdById,
            Pageable pageable) {

        return ticketService.searchTickets(
                status,
                priority,
                technicianId,
                createdById,
                pageable
        );
    }


    @GetMapping("/debug-security")
    public String debugSecurity(Authentication authentication) {

        return "User: "
                + authentication.getName()
                + " | Authorities: "
                + authentication.getAuthorities();
    }

}
