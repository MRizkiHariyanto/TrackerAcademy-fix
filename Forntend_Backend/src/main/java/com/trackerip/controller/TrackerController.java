package com.trackerip.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trackerip.model.TrackRecord;
import com.trackerip.model.TrackRequest;
import com.trackerip.service.TrackerService;

@RestController
@RequestMapping("/api/tracker")
@CrossOrigin(origins = "*")
public class TrackerController {

    private final TrackerService service;

    public TrackerController(TrackerService service) {
        this.service = service;
    }

    // Endpoint untuk menyimpan IPK
    @PostMapping("/simpan")
    public ResponseEntity<?> simpanTrack(@RequestBody TrackRequest request) {
        TrackRecord saved = service.save(request);
        return ResponseEntity.ok(saved);
    }

    // Endpoint untuk ambil semua data IPK milik user yang login
    @GetMapping("/semua")
    public List<TrackRecord> getAll() {
        return service.getAll(); // Ambil dari user login (via SecurityContext)
    }

    // Endpoint untuk fitur History (dipakai oleh dashboard.js)
    @GetMapping("/history")
    public ResponseEntity<List<TrackRecord>> getTrackRecordHistory() {
        List<TrackRecord> records = service.getAll(); // Sudah otomatis ambil user login
        return ResponseEntity.ok(records);
    }
    @GetMapping("/statistik")
    public ResponseEntity<?> getStatistik(@RequestParam int semester) {
        return ResponseEntity.ok(service.getStatistikBySemester(semester));
    }

    
}