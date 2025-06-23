package com.trackerip.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.trackerip.model.TrackRecord;
import com.trackerip.model.TrackRequest;
import com.trackerip.model.User;
import com.trackerip.repository.TrackRecordRepository;
import com.trackerip.repository.UserRepository;

@Service
public class TrackerService {

    private final TrackRecordRepository repository;
    private final UserRepository userRepository;

    public TrackerService(TrackRecordRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public TrackRecord save(TrackRequest request) {
        // Ambil username dari token JWT (dari SecurityContext)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // Ambil user dari database
        User user = userRepository.findByUsername(username).orElseThrow();

        // Simpan data IPK dengan kaitan ke user
        TrackRecord record = new TrackRecord();
        record.setSemester(request.getSemester());
        record.setIpk(Double.parseDouble(request.getIpk()));
        record.setMatkul(request.getMatkul());
        record.setUser(user);

        return repository.save(record);
    }

    public List<TrackRecord> getAll() {
        // Ambil user login saat ini
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        // Ambil semua IPK milik user ini saja
        return repository.findByUser(user);
    }
}