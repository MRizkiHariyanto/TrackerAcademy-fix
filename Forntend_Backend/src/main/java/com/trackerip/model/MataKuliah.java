package com.trackerip.model;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
public class MataKuliah {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String matkul;
    private double nilai;
    private int sks;
    private String nilaiLabel;

    @ManyToOne
    @JoinColumn(name = "track_record_id") // foreign key ke TrackRecord
    @JsonBackReference // ✅ untuk hindari infinite loop saat serialisasi
    private TrackRecord trackRecord;

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMatkul() { return matkul; }
    public void setMatkul(String matkul) { this.matkul = matkul; }

    public double getNilai() { return nilai; }
    public void setNilai(double nilai) { this.nilai = nilai; }

    public int getSks() { return sks; }
    public void setSks(int sks) { this.sks = sks; }

    public String getNilaiLabel() { return nilaiLabel; }
    public void setNilaiLabel(String nilaiLabel) { this.nilaiLabel = nilaiLabel; }

    public TrackRecord getTrackRecord() {
        return trackRecord;
    }

    public void setTrackRecord(TrackRecord trackRecord) {
        this.trackRecord = trackRecord;
    }
}