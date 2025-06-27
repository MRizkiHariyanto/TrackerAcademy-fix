package com.trackerip.repository;

import com.trackerip.model.Modul;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ModulRepository extends JpaRepository<Modul, Long> {
    @Query("SELECT m FROM Modul m WHERE LOWER(m.judul) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Modul> searchByKeyword(@Param("keyword") String keyword);
}
