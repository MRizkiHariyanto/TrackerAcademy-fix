package com.trackerip.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trackerip.model.TrackRecord;
import com.trackerip.model.User;

@Repository
public interface TrackRecordRepository extends JpaRepository<TrackRecord, Long> {
    List<TrackRecord> findByUser(User user); // ⬅️ Tambahkan method ini
    List<TrackRecord> findByUserUsername(String username);
    Optional<TrackRecord> findBySemesterAndUserId(int semester, Long userId);


}