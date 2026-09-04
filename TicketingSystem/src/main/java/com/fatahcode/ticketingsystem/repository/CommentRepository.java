package com.fatahcode.ticketingsystem.repository;

import com.fatahcode.ticketingsystem.entity.Comment;
import com.fatahcode.ticketingsystem.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTicket(Ticket ticket);
}