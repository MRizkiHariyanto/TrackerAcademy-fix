package com.trackerip.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trackerip.backend.model.User;
import com.trackerip.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public String register(@RequestParam String username,
                           @RequestParam String email,
                           @RequestParam String password) {

        if (userService.findByEmail(email).isPresent()) {
            return "Email already registered!";
        }

        if (userService.findByUsername(username).isPresent()) {
            return "Username already taken!";
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password); // ❗Belum di-hash ya

        userService.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {

        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return "Login successful!";
        }

        return "Invalid credentials!";
    }
}

