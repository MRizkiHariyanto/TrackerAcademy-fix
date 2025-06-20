package com.trackerip.controller;

import com.trackerip.model.TrackRequest;
import com.trackerip.model.TrackRecord;
import com.trackerip.service.TrackerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracker")
@CrossOrigin(origins = "*")
public class TrackerController {

    private final TrackerService service;

    public TrackerController(TrackerService service) {
        this.service = service;
    }

    @PostMapping("/simpan")
    public ResponseEntity<?> simpanTrack(@RequestBody TrackRequest request) {
        TrackRecord saved = service.save(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/semua")
    public List<TrackRecord> getAll() {
        return service.getAll();
    }
}