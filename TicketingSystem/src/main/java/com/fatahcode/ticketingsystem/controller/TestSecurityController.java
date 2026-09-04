package com.fatahcode.ticketingsystem.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestSecurityController {

    @GetMapping("/api/test-security")
    public String testSecurity(Authentication authentication) {

        return "User: " + authentication.getName()
                + " | Authorities: " + authentication.getAuthorities();
    }

    @GetMapping("/api/test-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String testAdmin() {

        return "Welcome Admin! You have access to this endpoint.";
    }
}
