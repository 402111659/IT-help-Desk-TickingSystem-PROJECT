package com.fatahcode.ticketingsystem.entity;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private String message;
    private LocalDateTime createdAt;
    private String userEmail;
    private Long ticketId;

    public CommentResponse() {
    }

    public CommentResponse(
            Long id,
            String message,
            LocalDateTime createdAt,
            String userEmail,
            Long ticketId) {

        this.id = id;
        this.message = message;
        this.createdAt = createdAt;
        this.userEmail = userEmail;
        this.ticketId = ticketId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }
}