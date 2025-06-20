package com.trackerip.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.trackerip.model.TrackRecord;
import com.trackerip.model.TrackRequest;
import com.trackerip.repository.TrackRecordRepository;

@Service
public class TrackerService {

    private final TrackRecordRepository repository;

    public TrackerService(TrackRecordRepository repository) {
        this.repository = repository;
    }

    public TrackRecord save(TrackRequest request) {
        TrackRecord record = new TrackRecord();
        record.setSemester(request.getSemester());
        record.setIpk(Double.parseDouble(request.getIpk()));
        record.setMatkul(request.getMatkul());
        return repository.save(record);
    }

    public List<TrackRecord> getAll() {
        return repository.findAll();
    }
}
