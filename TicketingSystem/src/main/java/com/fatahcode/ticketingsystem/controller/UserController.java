
package com.fatahcode.ticketingsystem.controller;

import com.fatahcode.ticketingsystem.entity.LoginResponse;
import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.entity.UserResponse;
import com.fatahcode.ticketingsystem.service.JwtService;
import com.fatahcode.ticketingsystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.fatahcode.ticketingsystem.entity.LoginRequest;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    private final JwtService jwtService;


    public UserController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;

        this.jwtService = jwtService;
    }


    // =====================================================
    // REGISTER EMPLOYEE
    // =====================================================

    @PostMapping("/register")
    public UserResponse registerUser(
            @Valid @RequestBody User user) {

        return userService.registerUser(user);
    }


    // =====================================================
    // REGISTER TECHNICIAN
    // ADMIN ONLY
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/technicians")
    public User registerTechnician(
            @RequestBody User user) {

        return userService.registerTechnician(user);
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest loginRequest) {

        User user =
                userService.login(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                );


        if (user == null) {
            return null;
        }


        String token =
                jwtService.generateToken(user);


        return new LoginResponse(
                "Login successful",
                user.getId(),
                user.getEmail(),
                token
        );
    }


    // =====================================================
    // GET ALL USERS
    // ADMIN ONLY
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }


    // =====================================================
    // GET TECHNICIANS
    // ADMIN + TECHNICIAN
    // =====================================================

    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @GetMapping("/technicians")
    public List<UserResponse> getTechnicians() {

        return userService.getTechnicians();
    }


    // =====================================================
    // UPDATE USER ROLE
    // ADMIN ONLY
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public UserResponse updateUserRole(
            @PathVariable Long id,
            @RequestBody String role) {

        role =
                role.replace("\"", "").trim();


        return userService.updateUserRole(
                id,
                role
        );
    }

}