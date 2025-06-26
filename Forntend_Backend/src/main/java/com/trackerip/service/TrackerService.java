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

    public Map<String, Object> getStatistikBySemester(int semester) {
    Long userId = 1L; // sementara hardcoded dulu

    TrackRecord tr = trackRecordRepo.findBySemesterAndUserId(semester, userId)
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


}
