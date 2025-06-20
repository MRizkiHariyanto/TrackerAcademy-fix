package com.trackerip.model;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

@Entity
public class TrackRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int semester;
    private double ipk;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "track_record_id")
    private List<MataKuliah> matkul;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public double getIpk() { return ipk; }
    public void setIpk(double ipk) { this.ipk = ipk; }

    public List<MataKuliah> getMatkul() { return matkul; }
    public void setMatkul(List<MataKuliah> matkul) { this.matkul = matkul; }
}
