package com.fatahcode.ticketingsystem.entity;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    private Long userId;

    public NotificationResponse() {
    }

    public NotificationResponse(
            Long id,
            String message,
            boolean read,
            LocalDateTime createdAt,
            Long userId) {

        this.id = id;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
        this.userId = userId;
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

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
