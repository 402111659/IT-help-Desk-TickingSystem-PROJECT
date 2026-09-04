package com.fatahcode.ticketingsystem.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {


    @GetMapping("/")
public String Home(){

return "IT helpdeskSystem is running";


}
}
