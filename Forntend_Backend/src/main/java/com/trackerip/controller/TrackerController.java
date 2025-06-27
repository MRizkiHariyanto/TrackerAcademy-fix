package com.trackerip.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // Endpoint untuk statistik IPK per semester
    @GetMapping("/statistik")
    public ResponseEntity<?> getStatistik(@RequestParam int semester) {
        return ResponseEntity.ok(service.getStatistikBySemester(semester));
    }

    // ✅ Endpoint baru: hapus track record berdasarkan ID
    @DeleteMapping("/history/{id}")
    public ResponseEntity<?> deleteTrackRecord(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
