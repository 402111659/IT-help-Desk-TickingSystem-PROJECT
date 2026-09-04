package com.fatahcode.ticketingsystem.security;

import com.fatahcode.ticketingsystem.entity.User;
import com.fatahcode.ticketingsystem.service.JwtService;
import com.fatahcode.ticketingsystem.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Component
public class GoogleOAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public GoogleOAuth2SuccessHandler(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    // =====================================================
    // GOOGLE LOGIN SUCCESS
    // =====================================================

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        // =================================================
        // GET GOOGLE USER
        // =================================================

        OAuth2User googleUser =
                (OAuth2User) authentication.getPrincipal();

        // =================================================
        // GET GOOGLE INFORMATION
        // =================================================

        String email =
                googleUser.getAttribute("email");

        String firstName =
                googleUser.getAttribute("given_name");

        String lastName =
                googleUser.getAttribute("family_name");

        System.out.println(
                "Google login successful for: " + email
        );

        // =================================================
        // VALIDATE EMAIL
        // =================================================

        if (email == null || email.isBlank()) {

            System.out.println(
                    "Google login failed: email was not provided."
            );

            response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Google account email could not be retrieved."
            );

            return;
        }

        // =================================================
        // FIND EXISTING USER
        // =================================================

        User user =
                userService.findByEmail(email);

        // =================================================
        // CREATE NEW GOOGLE USER
        // =================================================

        if (user == null) {

            System.out.println(
                    "Google user does not exist."
            );

            System.out.println(
                    "Creating new EMPLOYEE account..."
            );

            user = new User();

            // ---------------------------------------------
            // FIRST NAME
            // ---------------------------------------------

            user.setFirstName(
                    firstName != null
                            ? firstName
                            : ""
            );

            // ---------------------------------------------
            // LAST NAME
            // ---------------------------------------------

            user.setLastName(
                    lastName != null
                            ? lastName
                            : ""
            );

            // ---------------------------------------------
            // EMAIL
            // ---------------------------------------------

            user.setEmail(email);

            // ---------------------------------------------
            // ROLE
            // ---------------------------------------------

            user.setRole("EMPLOYEE");

            // ---------------------------------------------
            // PLACEHOLDER PASSWORD
            // ---------------------------------------------
            /*
             * Google users authenticate through Google.
             *
             * We do NOT store their Google password.
             *
             * Your User entity currently requires a password,
             * so we generate a random placeholder value.
             */

            user.setPassword(
                    "{GOOGLE}" + UUID.randomUUID()
            );

            // ---------------------------------------------
            // SAVE USER
            // ---------------------------------------------

            try {

                user =
                        userService
                                .registerGoogleUser(user);

                System.out.println(
                        "Google user created successfully."
                );

                System.out.println(
                        "User ID: " + user.getId()
                );

                System.out.println(
                        "Role: " + user.getRole()
                );

            } catch (Exception e) {

                System.out.println(
                        "ERROR: Unable to create Google user."
                );

                e.printStackTrace();

                response.sendError(
                        HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        "Unable to create Google user."
                );

                return;
            }

        } else {

            // =================================================
            // EXISTING USER
            // =================================================

            System.out.println(
                    "Existing ticketing-system user found."
            );

            System.out.println(
                    "User ID: " + user.getId()
            );

            System.out.println(
                    "User email: " + user.getEmail()
            );

            System.out.println(
                    "Existing role: " + user.getRole()
            );
        }

        // =================================================
        // GENERATE APPLICATION JWT
        // =================================================

        String token =
                jwtService.generateToken(user);

        System.out.println(
                "JWT generated for Google user."
        );

        // =================================================
        // BUILD ANGULAR CALLBACK URL
        // =================================================

        String redirectUrl =
                "http://localhost:4200/oauth2/callback"
                        + "?token="
                        + URLEncoder.encode(
                        token,
                        StandardCharsets.UTF_8
                )
                        + "&email="
                        + URLEncoder.encode(
                        user.getEmail(),
                        StandardCharsets.UTF_8
                )
                        + "&id="
                        + user.getId();

        // =================================================
        // DEBUG INFORMATION
        // =================================================

        System.out.println(
                "========================================"
        );

        System.out.println(
                "GOOGLE OAUTH SUCCESS"
        );

        System.out.println(
                "User: " + user.getEmail()
        );

        System.out.println(
                "Role: " + user.getRole()
        );

        System.out.println(
                "User ID: " + user.getId()
        );

        System.out.println(
                "JWT generated successfully."
        );

        System.out.println(
                "Redirecting to Angular:"
        );

        // Don't print the complete JWT to the console.
        System.out.println(
                "http://localhost:4200/oauth2/callback"
                        + "?token=[JWT]"
                        + "&email="
                        + user.getEmail()
                        + "&id="
                        + user.getId()
        );

        System.out.println(
                "========================================"
        );

        // =================================================
        // REDIRECT USER TO ANGULAR
        // =================================================

        response.sendRedirect(redirectUrl);
    }
}