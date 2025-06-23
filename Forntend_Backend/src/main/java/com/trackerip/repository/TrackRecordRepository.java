package com.trackerip.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trackerip.model.TrackRecord;
import com.trackerip.model.User;

@Repository
public interface TrackRecordRepository extends JpaRepository<TrackRecord, Long> {
    List<TrackRecord> findByUser(User user); // ⬅️ Tambahkan method ini
}