package com.trackerip.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.trackerip.model.MataKuliah;
import com.trackerip.model.TrackRecord;
import com.trackerip.model.TrackRequest;
import com.trackerip.model.User;
import com.trackerip.repository.MataKuliahRepository;
import com.trackerip.repository.TrackRecordRepository;
import com.trackerip.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class TrackerService {

    @Autowired
    private TrackRecordRepository trackRecordRepo;

    @Autowired
    private MataKuliahRepository mataKuliahRepo;

    private final TrackRecordRepository repository;
    private final UserRepository userRepository;

    public TrackerService(TrackRecordRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public TrackRecord save(TrackRequest request) {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username).orElseThrow();

        TrackRecord record = new TrackRecord();
        record.setSemester(request.getSemester());
        record.setIpk(Double.parseDouble(request.getIpk()));
        record.setMatkul(request.getMatkul());
        record.setUser(user);

        return repository.save(record);
    }

    @Transactional
    public List<TrackRecord> getAll() {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username).orElseThrow();

        return repository.findByUser(user);
    }

    @Transactional
    public List<TrackRecord> getAllTrackRecordsByUsername(String username) {
        return repository.findByUserUsername(username);
    }

    public Map<String, Object> getStatistikBySemester(int semester) {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username).orElseThrow();

        TrackRecord tr = trackRecordRepo.findBySemesterAndUserId(semester, user.getId())
            .orElseThrow(() -> new RuntimeException("Track record tidak ditemukan"));

        List<MataKuliah> matkulList = mataKuliahRepo.findByTrackRecordId(tr.getId());

        double totalNilai = 0;
        int totalSks = 0;
        for (MataKuliah mk : matkulList) {
            totalNilai += mk.getNilai() * mk.getSks();
            totalSks += mk.getSks();
        }

        double ipk = (totalSks > 0) ? totalNilai / totalSks : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("ipk", ipk);
        result.put("matkul", matkulList.stream().map(mk -> Map.of(
            "nama", mk.getMatkul(),
            "nilai", mk.getNilai()
        )).toList());

        return result;
    }

    // ✅ DELETE: Hapus track record by ID dengan validasi kepemilikan user
    @Transactional
    public void deleteById(Long id) {
        String username = getCurrentUsername();
        User user = userRepository.findByUsername(username).orElseThrow();

        System.out.println("🔍 Proses hapus IPK ID: " + id + " oleh user: " + username);

        TrackRecord record = trackRecordRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("❌ Track record tidak ditemukan: ID " + id));

        if (!record.getUser().getId().equals(user.getId())) {
            System.out.println("⚠️ Akses ditolak: user login bukan pemilik data");
            throw new RuntimeException("Akses ditolak: data bukan milik kamu");
        }

        trackRecordRepo.deleteById(id);
        System.out.println("✅ Berhasil menghapus track record dengan ID: " + id);
    }

    // 🔐 Helper untuk ambil username aktif dari JWT
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("User belum login atau token invalid");
        }
        return auth.getName();
    }
}
