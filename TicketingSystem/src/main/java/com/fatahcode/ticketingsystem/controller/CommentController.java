package com.fatahcode.ticketingsystem.controller;

import com.fatahcode.ticketingsystem.entity.CommentResponse;
import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.service.CommentService;
import com.fatahcode.ticketingsystem.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    public CommentController(
            CommentService commentService,
            UserService userService) {

        this.commentService = commentService;
        this.userService = userService;
    }


    // =====================================================
    // ADD COMMENT
    // =====================================================

    @PostMapping("/{ticketId}/comments")
    public CommentResponse addComment(
            @PathVariable Long ticketId,
            @RequestBody CommentRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return commentService.addComment(
                ticketId,
                request.getMessage(),
                user
        );
    }


    // =====================================================
    // GET COMMENTS
    // =====================================================

    @GetMapping("/{ticketId}/comments")
    public List<CommentResponse> getComments(
            @PathVariable Long ticketId,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return commentService.getCommentsForTicket(
                ticketId,
                user
        );
    }


    // =====================================================
    // REQUEST DTO
    // =====================================================

    public static class CommentRequest {

        private String message;


        public CommentRequest() {
        }


        public String getMessage() {
            return message;
        }


        public void setMessage(String message) {
            this.message = message;
        }
    }
}