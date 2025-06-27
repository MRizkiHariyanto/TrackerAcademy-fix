package com.trackerip.controller;

import com.trackerip.model.Modul;
import com.trackerip.service.ModulService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ModulController {

    private final ModulService modulService;

    public ModulController(ModulService modulService) {
        this.modulService = modulService;
    }

    @GetMapping("/modules/search")
    public List<Modul> searchModules(@RequestParam String keyword) {
        return modulService.searchModules(keyword);
    }
}
