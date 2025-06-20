package com.trackerip.model;

import java.util.List;

public class TrackRequest {
    private int semester;
    private String ipk;
    private List<MataKuliah> matkul;

    // Getters and Setters
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public String getIpk() { return ipk; }
    public void setIpk(String ipk) { this.ipk = ipk; }

    public List<MataKuliah> getMatkul() { return matkul; }
    public void setMatkul(List<MataKuliah> matkul) { this.matkul = matkul; }
}