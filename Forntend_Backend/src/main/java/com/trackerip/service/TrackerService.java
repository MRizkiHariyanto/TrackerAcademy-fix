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

import jakarta.transaction.Transactional;

@Service
public class TrackerService {

    private final TrackRecordRepository repository;
    private final UserRepository userRepository;

    public TrackerService(TrackRecordRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public TrackRecord save(TrackRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        TrackRecord record = new TrackRecord();
        record.setSemester(request.getSemester());
        record.setIpk(Double.parseDouble(request.getIpk()));
        record.setMatkul(request.getMatkul());
        record.setUser(user);

        return repository.save(record);
    }

    @Transactional  // ⛏️ penting agar koleksi matkul tidak gagal saat dikonversi ke JSON
    public List<TrackRecord> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        return repository.findByUser(user);
    }

    @Transactional  // ⛏️ untuk endpoint /history yang akses via username
    public List<TrackRecord> getAllTrackRecordsByUsername(String username) {
        return repository.findByUserUsername(username);
    }
}
