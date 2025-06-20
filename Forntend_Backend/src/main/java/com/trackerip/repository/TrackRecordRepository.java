package com.trackerip.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trackerip.model.TrackRecord;

@Repository
public interface TrackRecordRepository extends JpaRepository<TrackRecord, Long> {
}