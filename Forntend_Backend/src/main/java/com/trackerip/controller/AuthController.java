package com.trackerip.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
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

    @PostMapping("/signup")
    public Map<String,Object> signup(@RequestBody User u){
        Map<String,Object> res = new HashMap<>();
        if(userService.findByUsername(u.getUsername()).isPresent()){
            res.put("status","error"); res.put("message","Username already taken!"); return res;
        }
        if(userService.findByEmail(u.getEmail()).isPresent()){
            res.put("status","error"); res.put("message","Email already registered!"); return res;
        }
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        userService.save(u);
        res.put("status","success"); res.put("message","Signup berhasil!");
        return res;
    }

    @PostMapping("/login")
    public Map<String,Object> login(@RequestBody User req){
        Map<String,Object> res = new HashMap<>();
        try{
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(),req.getPassword()));
            UserDetails user = (UserDetails) auth.getPrincipal();
            String token = jwtService.generateToken(user);
            res.put("status","success");
            res.put("username",user.getUsername());
            res.put("token",token);
            res.put("message","Login berhasil!");
        }catch(AuthenticationException e){
            res.put("status","error");
            res.put("message","Username atau password salah!");
        }
        return res;
    }
}
