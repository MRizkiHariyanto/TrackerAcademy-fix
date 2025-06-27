package com.trackerip.model;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class TrackRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int semester;
    private double ipk;

    @OneToMany(
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.EAGER // ✅ ambil langsung data matkul saat load TrackRecord
    )
    
    @JoinColumn(name = "track_record_id") // foreign key di tabel mata_kuliah
    @JsonManagedReference // ✅ supaya bisa dikirim ke frontend tanpa loop
    private List<MataKuliah> matkul;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore // ✅ biar user gak ikut dikirim ke frontend
    private User user;

    // === GETTER & SETTER ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public double getIpk() {
        return ipk;
    }

    public void setIpk(double ipk) {
        this.ipk = ipk;
    }

    public List<MataKuliah> getMatkul() {
        return matkul;
    }

    public void setMatkul(List<MataKuliah> matkul) {
        this.matkul = matkul;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}