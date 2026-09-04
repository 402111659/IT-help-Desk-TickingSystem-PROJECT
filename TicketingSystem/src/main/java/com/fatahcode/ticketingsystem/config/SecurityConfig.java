package com.fatahcode.ticketingsystem.config;

import com.fatahcode.ticketingsystem.security.GoogleOAuth2SuccessHandler;
import com.fatahcode.ticketingsystem.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;

        this.googleOAuth2SuccessHandler =
                googleOAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =============================================
                // CSRF
                // =============================================

                .csrf(csrf ->
                        csrf.disable()
                )


                // =============================================
                // CORS
                // =============================================

                .cors(cors -> {})


                // =============================================
                // SESSION
                // =============================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )


                // =============================================
                // AUTHORIZATION
                // =============================================

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/users/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        .requestMatchers(
                                "/oauth2/**",
                                "/login/**"
                        ).permitAll()

                        .anyRequest().authenticated()
                )


                // =============================================
                // GOOGLE OAUTH2 LOGIN
                // =============================================

                .oauth2Login(oauth2 ->
                        oauth2.successHandler(
                                googleOAuth2SuccessHandler
                        )
                )


                // =============================================
                // JWT AUTHENTICATION
                // =============================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}