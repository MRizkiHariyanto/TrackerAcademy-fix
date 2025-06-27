package com.trackerip.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trackerip.model.User;
import com.trackerip.service.JwtService;
import com.trackerip.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired private UserService userService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;
    @Autowired private AuthenticationManager authManager;

    // ========== SIGNUP ==========
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody User u) {
        Map<String, Object> res = new HashMap<>();

        if (userService.findByUsername(u.getUsername()).isPresent()) {
            res.put("message", "Username sudah digunakan!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res); // 409 Conflict
        }
        if (userService.findByEmail(u.getEmail()).isPresent()) {
            res.put("message", "Email sudah terdaftar!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(res); // 409 Conflict
        }

        u.setPassword(passwordEncoder.encode(u.getPassword()));
        userService.save(u);

        res.put("message", "Signup berhasil!");
        return ResponseEntity.status(HttpStatus.CREATED).body(res); // 201 Created
    }

    // ========== LOGIN ==========
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User req) {
        Map<String, Object> res = new HashMap<>();
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );

            UserDetails user = (UserDetails) auth.getPrincipal();
            String token = jwtService.generateToken(user);

            res.put("username", user.getUsername());
            res.put("token", token);
            return ResponseEntity.ok(res); // 200 OK
        } catch (AuthenticationException e) {
            res.put("message", "Username atau password salah!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res); // 401 Unauthorized
        }
    }

     // ========== VALIDASI TOKEN ==========
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken() {
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Token valid");
        return ResponseEntity.ok(res); // hanya akan sampai sini jika token valid
    }
}
