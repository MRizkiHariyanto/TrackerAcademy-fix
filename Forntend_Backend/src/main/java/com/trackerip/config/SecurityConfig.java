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

    // Provider autentikasi
    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain filter(HttpSecurity http) throws Exception {

        // 1. Nonaktifkan CSRF hanya untuk endpoint publik
        http.csrf(csrf -> csrf
            .ignoringRequestMatchers(
                "/h2-console/**",
                "/api/auth/**",
                "/api/tracker/simpan"  // hanya simpan yang public
            )
        );

        // 2. Izinkan akses frame H2 console
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        // 3. Konfigurasi akses endpoint
http.authorizeHttpRequests(auth -> auth

            // PUBLIC
            .requestMatchers(
                "/", "/index.html",
                "/frontend/**",
                "/css/**", "/js/**", "/favicon.ico",
                "/h2-console/**",
                "/api/auth/**",
                "/api/tracker/simpan"
            ).permitAll()

            // PROTECTED (hanya bisa diakses jika login)
            .requestMatchers(
                "/api/tracker/semua",
                "/api/tracker/hapus/**",
                "/api/tracker/history"
            ).authenticated()

            // LAINNYA
            .anyRequest().denyAll()
        );

        // 4. Gunakan JWT (stateless)
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authenticationProvider(authProvider());
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Manager untuk login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
