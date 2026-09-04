package com.fatahcode.ticketingsystem.service;

import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.entity.UserResponse;
import com.fatahcode.ticketingsystem.exception.DuplicateResourceException;
import com.fatahcode.ticketingsystem.exception.ResourceNotFoundException;
import com.fatahcode.ticketingsystem.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;
    }


    // =====================================================
    // REGISTER EMPLOYEE
    // =====================================================

    public UserResponse registerUser(User user) {

        if (userRepository
                .findByEmail(user.getEmail())
                .isPresent()) {

            throw new DuplicateResourceException(
                    "Email is already registered"
            );
        }


        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );


        user.setRole("EMPLOYEE");


        User savedUser =
                userRepository.save(user);


        return toResponse(savedUser);
    }


    // =====================================================
    // LOGIN
    // =====================================================

    public User login(
            String email,
            String password) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);


        if (user == null) {
            return null;
        }


        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            return null;
        }


        return user;
    }


    // =====================================================
    // FIND USER BY EMAIL
    // =====================================================

    public User findByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }


    // =====================================================
    // REGISTER TECHNICIAN
    // =====================================================

    public User registerTechnician(User user) {

        if (userRepository
                .findByEmail(user.getEmail())
                .isPresent()) {

            throw new DuplicateResourceException(
                    "Email is already registered"
            );
        }


        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );


        user.setRole("TECHNICIAN");


        return userRepository.save(user);
    }


    // =====================================================
    // GET ALL USERS
    // ADMIN ONLY
    // =====================================================

    public List<UserResponse> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // GET TECHNICIANS
    // =====================================================

    public List<UserResponse> getTechnicians() {

        return userRepository
                .findAll()
                .stream()
                .filter(user ->
                        "TECHNICIAN".equals(user.getRole())
                )
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // CONVERT USER TO RESPONSE
    // =====================================================

    private UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }


    // =====================================================
    // UPDATE USER ROLE
    // =====================================================

    public UserResponse updateUserRole(
            Long userId,
            String newRole) {

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                        );


        if (!"EMPLOYEE".equals(newRole)
                && !"TECHNICIAN".equals(newRole)
                && !"ADMIN".equals(newRole)) {

            throw new RuntimeException(
                    "Invalid role"
            );
        }


        user.setRole(newRole);


        User savedUser =
                userRepository.save(user);


        return toResponse(savedUser);
    }



    // =====================================================
// REGISTER GOOGLE USER
// =====================================================

    public User registerGoogleUser(User user) {

        if (userRepository
                .findByEmail(user.getEmail())
                .isPresent()) {

            return userRepository
                    .findByEmail(user.getEmail())
                    .get();
        }


        user.setRole("EMPLOYEE");


        return userRepository.save(user);
    }

}