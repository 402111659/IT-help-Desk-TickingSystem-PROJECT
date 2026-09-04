package com.fatahcode.ticketingsystem.service;

import com.fatahcode.ticketingsystem.entity.Notification;
import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.exception.ResourceNotFoundException;
import com.fatahcode.ticketingsystem.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fatahcode.ticketingsystem.entity.NotificationResponse;
import com.fatahcode.ticketingsystem.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(
            User user,
            String message) {

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setMessage(message);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    public List<NotificationResponse> getUserNotifications(User user) {

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public NotificationResponse markAsRead(Long id, User user) {

        Notification notification = notificationRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {

            throw new ResourceNotFoundException(
                    "You are not allowed to modify this notification"
            );
        }

        notification.setRead(true);

        Notification savedNotification =
                notificationRepository.save(notification);

        return toResponse(savedNotification);
    }

    public long getUnreadNotificationCount(User user) {

        return notificationRepository
                .countByUserAndReadFalse(user);
    }

    @Transactional
    public int markAllAsRead(User user) {

        return notificationRepository.markAllAsRead(user);
    }


    private NotificationResponse toResponse(Notification notification) {

        return new NotificationResponse(
                notification.getId(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getUser().getId()
        );
    }

}
