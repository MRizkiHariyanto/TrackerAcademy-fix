// src/main/java/com/trackerip/backend/config/SecurityConfig.java
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

    @Autowired private JwtAuthenticationFilter jwtFilter;
    @Autowired private CustomUserDetailsService userDetailsService;

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(userDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    @Bean
    public SecurityFilterChain filter(HttpSecurity http) throws Exception {

        /* 1. CSRF nonaktif utk H2 + Auth API saja */
        http.csrf(c -> c.ignoringRequestMatchers("/h2-console/**", "/api/auth/**"));

        /* 2. Header -> biar H2 bisa embed */
        http.headers(h -> h.frameOptions(f -> f.disable()));

        /* 3. Authorize mapping */
        http.authorizeHttpRequests(auth -> auth

                /* ---- PUBLIC ---- */
                .requestMatchers(
                        "/",                   /* root   */
                        "/index.html",
                        "/frontend/**",        /* semua static frontend */
                        "/css/**", "/js/**",
                        "/h2-console/**",
                        "/api/auth/**"         /* signup / login */
                ).permitAll()

                /* ---- PROTECTED ---- */
                .requestMatchers(
                        "/api/tracker/**",
                        "/api/modules/**"
                ).authenticated()

                /* deny yang tak terdaftar */
                .anyRequest().denyAll()
        );

        /* 4. Stateless + filter JWT */
        http.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authProvider())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg)
            throws Exception { return cfg.getAuthenticationManager(); }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}
