package com.fatahcode.ticketingsystem.controller;

import com.fatahcode.ticketingsystem.entity.NotificationResponse;
import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.service.NotificationService;
import com.fatahcode.ticketingsystem.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(
            NotificationService notificationService,
            UserService userService) {

        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public List<NotificationResponse> getMyNotifications(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return notificationService.getUserNotifications(user);
    }

    @PutMapping("/{id}/read")
    public NotificationResponse markAsRead(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return notificationService.markAsRead(id, user);
    }

    @GetMapping("/unread-count")
    public long getUnreadNotificationCount(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return notificationService.getUnreadNotificationCount(user);
    }

    @PutMapping("/read-all")
    public int markAllAsRead(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.findByEmail(email);

        return notificationService.markAllAsRead(user);
    }
}