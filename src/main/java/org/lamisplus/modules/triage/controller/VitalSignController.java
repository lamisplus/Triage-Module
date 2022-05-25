package org.lamisplus.modules.triage.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.triage.domain.dto.VitalSignDto;
import org.lamisplus.modules.triage.domain.entity.TriagePostService;
import org.lamisplus.modules.triage.repository.TriagePostServiceRepository;
import org.lamisplus.modules.triage.service.VitalSignService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/patient/vital-sign")
public class VitalSignController {

    private final VitalSignService vitalSignService;

    private final TriagePostServiceRepository triagePostServiceRepository;

    @PostMapping
    public ResponseEntity<VitalSignDto> createVitalSign(@RequestBody VitalSignDto vitalSignDto) {
        return ResponseEntity.ok (vitalSignService.registerVitalSign (vitalSignDto));
    }

    @GetMapping
    public ResponseEntity<List<VitalSignDto>> getAllVitalSign() {
        return ResponseEntity.ok (vitalSignService.getVitalSign ());
    }
 @GetMapping("/{id}")
    public ResponseEntity<VitalSignDto> getVisitById(@PathVariable("id") Long id) {
        return ResponseEntity.ok (vitalSignService.getVitalSignById (id));
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<VitalSignDto>> getVitalSignByPersonId(@PathVariable("personId") Long personId) {
        return ResponseEntity.ok (vitalSignService.getVitalSignByPersonId (personId));
    }

    @GetMapping("/post-service")
    public ResponseEntity<List<TriagePostService>> getVitalSign() {
        return ResponseEntity.ok (triagePostServiceRepository.findAll ());
    }




    @PutMapping(value = "/{id}")
    public ResponseEntity<VitalSignDto> updateVitalSign(
            @PathVariable("id") Long id,
            @RequestBody VitalSignDto vitalSignDto) {
        return ResponseEntity.ok (vitalSignService.updateVitalSign (id, vitalSignDto));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<String> deleteVitalSign(@PathVariable("id") Long id) {
        vitalSignService.archivedVitalSign (id);
        return ResponseEntity.accepted ().build ();
    }

}
