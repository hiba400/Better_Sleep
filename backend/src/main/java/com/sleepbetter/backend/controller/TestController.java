package com.sleepbetter.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")  // route racine
    public String home() {
        return "Backend fonctionne !";
    }

    @GetMapping("/api/test")  // route API test
    public String test() {
        return "API test OK !";
    }
}
