package com.trackerip.config;

import com.trackerip.service.CustomUserDetailsService;
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

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain filter(HttpSecurity http) throws Exception {

        // ✅ 1. Nonaktifkan CSRF sepenuhnya (karena pakai JWT)
        http.csrf(csrf -> csrf.disable());

        // 2. Izinkan akses ke H2 Console
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        // 3. Konfigurasi endpoint
        http.authorizeHttpRequests(auth -> auth
            // Public
            .requestMatchers(
                "/", "/index.html",
                "/frontend/**",  
                 "/assets/**", 
                 "/favicon.ico",
                "/h2-console/**",
                "/api/auth/**",
                "/api/tracker/simpan"
            ).permitAll()

            // Protected
            .requestMatchers(
                "/api/modules/search",
                "/api/tracker/semua",
                "/api/tracker/hapus/**",
                "/api/tracker/history",
                "/api/tracker/history/**",  // 🛡️ Termasuk DELETE
                "/api/tracker/statistik"
            ).authenticated()

            // Semua lainnya ditolak
            .anyRequest().denyAll()
        );

        // 4. Stateless JWT Auth
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authenticationProvider(authProvider());
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
