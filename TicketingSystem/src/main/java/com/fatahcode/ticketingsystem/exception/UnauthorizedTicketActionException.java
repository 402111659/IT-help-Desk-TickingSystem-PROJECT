package com.fatahcode.ticketingsystem.exception;

public class UnauthorizedTicketActionException extends  RuntimeException {
    public UnauthorizedTicketActionException(String message) {
        super(message);
    }
}
