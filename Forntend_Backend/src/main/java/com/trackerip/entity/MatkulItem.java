package com.trackerip.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class MatkulItem {
    private String matkul;
    private int sks;
    private double nilai;
    private String nilaiLabel;
}
