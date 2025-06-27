package com.trackerip.model;

import jakarta.persistence.*;

@Entity
public class Modul {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String judul;
    private String penulis;
    private String tanggal;
    private int jumlahDibaca;
    private String linkDrive;

    // Getter & Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJudul() {
        return judul;
    }

    public void setJudul(String judul) {
        this.judul = judul;
    }

    public String getPenulis() {
        return penulis;
    }

    public void setPenulis(String penulis) {
        this.penulis = penulis;
    }

    public String getTanggal() {
        return tanggal;
    }

    public void setTanggal(String tanggal) {
        this.tanggal = tanggal;
    }

    public int getJumlahDibaca() {
        return jumlahDibaca;
    }

    public void setJumlahDibaca(int jumlahDibaca) {
        this.jumlahDibaca = jumlahDibaca;
    }

    public String getLinkDrive() {
        return linkDrive;
    }

    public void setLinkDrive(String linkDrive) {
        this.linkDrive = linkDrive;
    }
}
