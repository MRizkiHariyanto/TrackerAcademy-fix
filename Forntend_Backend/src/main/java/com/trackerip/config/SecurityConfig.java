// src/main/java/com/trackerip/backend/config/SecurityConfig.java
package com.trackerip.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.trackerip.service.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // Provider untuk validasi login
    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain filter(HttpSecurity http) throws Exception {

        // 1. Nonaktifkan CSRF untuk beberapa endpoint
        http.csrf(csrf -> csrf.ignoringRequestMatchers(
            "/h2-console/**",
            "/api/auth/**",
            "/api/tracker/**" // agar frontend bisa post IPK tanpa token
        ));

        // 2. Izinkan frame untuk H2 Console (jika pakai)
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        // 3. Konfigurasi izin endpoint
        http.authorizeHttpRequests(auth -> auth

            // ======== PUBLIC =========
            .requestMatchers(
                "/", "/index.html",
                "/frontend/**",          // folder frontend kamu
                "/css/**", "/js/**",
                "/favicon.ico",
                "/h2-console/**",
                "/api/auth/**",          // login & signup
                "/api/tracker/**"        // <- dibuka untuk simpan IPK tanpa token
            ).permitAll()

            // ======== PROTECTED =========
            .requestMatchers("/api/modules/**").authenticated()

            // ======== LAINNYA =========
            .anyRequest().denyAll()
        );

        // 4. Stateless + JWT filter
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authenticationProvider(authProvider());
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Manager untuk autentikasi login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Encoder password untuk login
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}