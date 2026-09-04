package com.fatahcode.ticketingsystem.service;

import com.fatahcode.ticketingsystem.entity.Comment;
import com.fatahcode.ticketingsystem.entity.CommentResponse;
import com.fatahcode.ticketingsystem.entity.Ticket;
import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.exception.UnauthorizedTicketActionException;
import com.fatahcode.ticketingsystem.repository.CommentRepository;
import com.fatahcode.ticketingsystem.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public CommentService(
            CommentRepository commentRepository,
            TicketRepository ticketRepository) {

        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
    }


    // =====================================================
    // ADD COMMENT
    // =====================================================

    public CommentResponse addComment(
            Long ticketId,
            String message,
            User user) {

        // -------------------------------------------------
        // Validate message
        // -------------------------------------------------

        if (message == null || message.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Comment message cannot be empty"
            );
        }


        // -------------------------------------------------
        // Find ticket
        // -------------------------------------------------

        Ticket ticket =
                ticketRepository.findById(ticketId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"
                                )
                        );


        // -------------------------------------------------
        // Get user role
        // -------------------------------------------------

        String role = user.getRole();

        boolean allowed = false;


        // =================================================
        // ADMIN
        // =================================================

        if ("ADMIN".equals(role)) {

            allowed = true;

        }


        // =================================================
        // EMPLOYEE
        // =================================================

        else if ("EMPLOYEE".equals(role)) {

            if (
                    ticket.getCreatedBy() != null &&
                            ticket.getCreatedBy()
                                    .getId()
                                    .equals(user.getId())
            ) {

                allowed = true;

            }

        }


        // =================================================
        // TECHNICIAN
        // =================================================

        else if ("TECHNICIAN".equals(role)) {

            if (
                    ticket.getAssignedTechnician() != null &&
                            ticket.getAssignedTechnician()
                                    .getId()
                                    .equals(user.getId())
            ) {

                allowed = true;

            }

        }


        // =================================================
        // DEBUG INFORMATION
        // =================================================

        System.out.println(
                "========== COMMENT PERMISSION DEBUG =========="
        );

        System.out.println(
                "Current user ID: "
                        + user.getId()
        );

        System.out.println(
                "Current user email: "
                        + user.getEmail()
        );

        System.out.println(
                "Current user role: "
                        + user.getRole()
        );

        System.out.println(
                "Ticket ID: "
                        + ticket.getId()
        );


        // -------------------------------------------------
        // Created By
        // -------------------------------------------------

        if (ticket.getCreatedBy() != null) {

            System.out.println(
                    "Created by ID: "
                            + ticket.getCreatedBy().getId()
            );

            System.out.println(
                    "Created by email: "
                            + ticket.getCreatedBy().getEmail()
            );

        } else {

            System.out.println(
                    "Created by: NULL"
            );

        }


        // -------------------------------------------------
        // Assigned Technician
        // -------------------------------------------------

        if (ticket.getAssignedTechnician() != null) {

            System.out.println(
                    "Assigned technician ID: "
                            + ticket.getAssignedTechnician().getId()
            );

            System.out.println(
                    "Assigned technician email: "
                            + ticket.getAssignedTechnician().getEmail()
            );

        } else {

            System.out.println(
                    "Assigned technician: NULL"
            );

        }


        System.out.println(
                "Permission allowed: "
                        + allowed
        );

        System.out.println(
                "=============================================="
        );


        // =================================================
        // DENY ACCESS
        // =================================================

        if (!allowed) {

            throw new UnauthorizedTicketActionException(
                    "You are not allowed to comment on this ticket"
            );

        }


        // =================================================
        // CREATE COMMENT
        // =================================================

        Comment comment = new Comment();

        comment.setMessage(
                message.trim()
        );

        comment.setTicket(
                ticket
        );

        comment.setUser(
                user
        );


        // =================================================
        // SAVE COMMENT
        // =================================================

        Comment savedComment =
                commentRepository.save(comment);


        // =================================================
        // RETURN RESPONSE
        // =================================================

        return new CommentResponse(

                savedComment.getId(),

                savedComment.getMessage(),

                savedComment.getCreatedAt(),

                savedComment.getUser().getEmail(),

                savedComment.getTicket().getId()

        );
    }


    // =====================================================
    // GET COMMENTS FOR TICKET
    // =====================================================

    public List<CommentResponse> getCommentsForTicket(
            Long ticketId,
            User user) {

        // -------------------------------------------------
        // Find ticket
        // -------------------------------------------------

        Ticket ticket =
                ticketRepository.findById(ticketId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"
                                )
                        );


        // -------------------------------------------------
        // Get user role
        // -------------------------------------------------

        String role = user.getRole();

        boolean allowed = false;


        // =================================================
        // ADMIN
        // =================================================

        if ("ADMIN".equals(role)) {

            allowed = true;

        }


        // =================================================
        // EMPLOYEE
        // =================================================

        else if ("EMPLOYEE".equals(role)) {

            if (
                    ticket.getCreatedBy() != null &&
                            ticket.getCreatedBy()
                                    .getId()
                                    .equals(user.getId())
            ) {

                allowed = true;

            }

        }


        // =================================================
        // TECHNICIAN
        // =================================================

        else if ("TECHNICIAN".equals(role)) {

            if (
                    ticket.getAssignedTechnician() != null &&
                            ticket.getAssignedTechnician()
                                    .getId()
                                    .equals(user.getId())
            ) {

                allowed = true;

            }

        }


        // =================================================
        // DEBUG INFORMATION
        // =================================================

        System.out.println(
                "========== COMMENT VIEW PERMISSION DEBUG =========="
        );

        System.out.println(
                "Current user ID: "
                        + user.getId()
        );

        System.out.println(
                "Current user email: "
                        + user.getEmail()
        );

        System.out.println(
                "Current user role: "
                        + user.getRole()
        );

        System.out.println(
                "Ticket ID: "
                        + ticket.getId()
        );


        if (ticket.getAssignedTechnician() != null) {

            System.out.println(
                    "Assigned technician ID: "
                            + ticket.getAssignedTechnician().getId()
            );

            System.out.println(
                    "Assigned technician email: "
                            + ticket.getAssignedTechnician().getEmail()
            );

        } else {

            System.out.println(
                    "Assigned technician: NULL"
            );

        }


        System.out.println(
                "Permission allowed: "
                        + allowed
        );

        System.out.println(
                "=================================================="
        );


        // =================================================
        // DENY ACCESS
        // =================================================

        if (!allowed) {

            throw new UnauthorizedTicketActionException(
                    "You are not allowed to view comments on this ticket"
            );

        }


        // =================================================
        // GET COMMENTS
        // =================================================

        List<Comment> comments =
                commentRepository.findByTicket(ticket);


        // =================================================
        // CONVERT TO RESPONSE
        // =================================================

        return comments.stream()

                .map(comment ->
                        new CommentResponse(

                                comment.getId(),

                                comment.getMessage(),

                                comment.getCreatedAt(),

                                comment.getUser().getEmail(),

                                comment.getTicket().getId()

                        )
                )

                .toList();
    }
}