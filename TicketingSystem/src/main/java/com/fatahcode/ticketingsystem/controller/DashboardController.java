package com.fatahcode.ticketingsystem.controller;

import com.fatahcode.ticketingsystem.entity.DashboardResponse;
import com.fatahcode.ticketingsystem.service.DashboardService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.fatahcode.ticketingsystem.entity.TechnicianStatisticsResponse;
import java.util.List;


@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboardStatistics();
    }


    @GetMapping("/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TechnicianStatisticsResponse> getTechnicianStatistics() {

        return dashboardService.getTechnicianStatistics();
    }
}