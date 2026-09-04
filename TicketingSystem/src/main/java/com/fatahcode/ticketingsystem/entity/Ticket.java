package com.fatahcode.ticketingsystem.entity;


import com.fatahcode.ticketingsystem.enums.TicketPriority;
import com.fatahcode.ticketingsystem.enums.TicketStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ticketNumber;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @NotNull(message = "Priority is required")
    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    @ManyToOne
    @JoinColumn(name = "assigned_technician_id")
    private User assignedTechnician;
    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    public Ticket(){
    }


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }



    public Long getId(){
        return id;
    }


    public  void setId(Long id ){
        this.id = id;
    }

    public  String getTitle(){
        return title;
    }

    public void  setTitle(String title){
        this.title = title;
    }

    public String getDescription(){
        return description;
    }

    public  void setDescription(String description){
        this.description = description;
    }

    public TicketStatus getStatus(){
        return  status;
    }

   public void setStatus(TicketStatus status){
        this.status = status;
   }

   public  TicketPriority getPriority(){
        return priority;
   }

   public void setPriority(TicketPriority priority){
        this.priority = priority;
   }



    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getAssignedTechnician() {
        return assignedTechnician;
    }

    public void setAssignedTechnician(User assignedTechnician) {
        this.assignedTechnician = assignedTechnician;
    }



    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }


}
