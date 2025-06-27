package com.trackerip.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.trackerip.service.CustomUserDetailsService;
import com.trackerip.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req,
                                    @NonNull HttpServletResponse res,
                                    @NonNull FilterChain chain)
            throws ServletException, IOException {

        String uri = req.getRequestURI();
        String method = req.getMethod();
        System.out.println("🛰️ Incoming Request: " + method + " " + uri);

        String header = req.getHeader("Authorization");
        System.out.println("🔐 Auth Header: " + header);

        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("⚠️ Tidak ada token Bearer di header");
            chain.doFilter(req, res);
            return;
        }

        String token = header.substring(7);
        String username = jwtService.extractUsername(token);
        System.out.println("📦 JWT subject (username): " + username);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                var userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("✅ UserDetails ditemukan: " + userDetails.getUsername());

                if (jwtService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("🔐 Auth berhasil diset di SecurityContext untuk: " + username);
                } else {
                    System.out.println("❌ Token JWT tidak valid untuk user: " + username);
                }

            } catch (UsernameNotFoundException e) {
                System.out.println("❌ Username tidak ditemukan di database: " + username);
            } catch (Exception e) {
                System.out.println("❌ ERROR saat proses autentikasi: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("⛔ SecurityContext sudah ada, skip auth setup.");
        }

        chain.doFilter(req, res);
    }
}
