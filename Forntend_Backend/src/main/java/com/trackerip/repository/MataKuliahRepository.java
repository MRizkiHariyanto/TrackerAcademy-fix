package com.trackerip.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trackerip.model.MataKuliah;

public interface MataKuliahRepository extends JpaRepository<MataKuliah, Long> {
    List<MataKuliah> findByTrackRecordId(Long trackRecordId);
}
