package com.trackerip.service;

import com.trackerip.model.Modul;
import com.trackerip.repository.ModulRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModulService {

    private final ModulRepository modulRepository;

    public ModulService(ModulRepository modulRepository) {
        this.modulRepository = modulRepository;
    }

    public List<Modul> searchModules(String keyword) {
        return modulRepository.searchByKeyword(keyword);
    }
}
