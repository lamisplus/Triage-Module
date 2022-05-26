package org.lamisplus.modules.triage.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.triage.domain.dto.VitalSignDto;
import org.lamisplus.modules.triage.domain.entity.VitalSign;
import org.lamisplus.modules.triage.repository.VitalSignRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VitalSignService {
    private final VitalSignRepository vitalSignRepository;
    private final PersonRepository personRepository;


    public void archivedVitalSign(Long id) {
        VitalSign existingVitalSign = getExistingVitalSign (id);
        existingVitalSign.setArchived (1);
        vitalSignRepository.save (existingVitalSign);
    }


    public VitalSignDto registerVitalSign(VitalSignDto vitalSignDto) {
        log.info ("I am in service {}", vitalSignDto.getEncounterDate ());
        Long personId = vitalSignDto.getPersonId ();
        getExistingPerson (personId);
        Optional<VitalSign> existVitalSignByVisitId = getExistVitalSignByVisitId (vitalSignDto.getVisitId ());
        if (existVitalSignByVisitId.isPresent ())
            throw new RecordExistException (VitalSignService.class, "Vital Sign already exist for this visit " + vitalSignDto.getVisitId ());
        VitalSign vitalSign = convertVitalSignDtoToVitalSignEntity (vitalSignDto);
        vitalSign.setUuid (UUID.randomUUID ().toString ());
        vitalSign.setArchived (0);
        VitalSign saveVitalSign = vitalSignRepository.save (vitalSign);
        return convertVitalSignEntityToVitalSignDto (saveVitalSign);
    }


    private Optional<VitalSign> getExistVitalSignByVisitId(Long visitId) {
        return vitalSignRepository.getVitalSignByVisitIdAndArchived (visitId, 0);
    }

    public VitalSignDto getVitalSignByVisitId(Long visitId) {
        VitalSign vitalSign = getExistVitalSignByVisitId (visitId)
                .orElseThrow (() -> new EntityNotFoundException (VitalSignService.class, "No Vital Sign found for this visit " + visitId));
        return convertVitalSignEntityToVitalSignDto (vitalSign);

    }


    public VitalSignDto updateVitalSign(Long id, VitalSignDto vitalSignDto) {
        VitalSign existingVitalSign = getExistingVitalSign (id);
        VitalSign vitalSign = convertVitalSignDtoToVitalSignEntity (vitalSignDto);
        vitalSign.setId (existingVitalSign.getId ());
        vitalSign.setArchived (0);
        VitalSign updateVitalSign = vitalSignRepository.save (vitalSign);
        return convertVitalSignEntityToVitalSignDto (updateVitalSign);
    }


    public List<VitalSignDto> getVitalSign() {
        return vitalSignRepository.getVitalSignByArchived (0)
                .stream ()
                .map (this::convertVitalSignEntityToVitalSignDto)
                .collect (Collectors.toList ());
    }

    public VitalSignDto getVitalSignById(Long id) {
        return convertVitalSignEntityToVitalSignDto (getExistingVitalSign (id));
    }

    public List<VitalSignDto> getVitalSignByPersonId(Long personId) {
        return vitalSignRepository.getVitalSignByPersonIdAndArchived (personId, 0)
                .stream ()
                .map (this::convertVitalSignEntityToVitalSignDto)
                .collect (Collectors.toList ());
    }


    private VitalSign getExistingVitalSign(Long id) {
        return vitalSignRepository
                .findById (id)
                .orElseThrow (() -> new EntityNotFoundException (VitalSignService.class, "No vital sign found with id " + id));
    }

    private Person getExistingPerson(Long personId) {
        return personRepository
                .findById (personId)
                .orElseThrow (() -> new EntityNotFoundException (VitalSignService.class, "No person found with id " + personId));
    }

    private VitalSign convertVitalSignDtoToVitalSignEntity(VitalSignDto vitalSignDto) {
        VitalSign vitalSign = new VitalSign ();
        BeanUtils.copyProperties (vitalSignDto, vitalSign);
        return vitalSign;
    }


    private VitalSignDto convertVitalSignEntityToVitalSignDto(VitalSign vitalSign) {
        VitalSignDto vitalSignDto = new VitalSignDto ();
        BeanUtils.copyProperties (vitalSign, vitalSignDto);
        return vitalSignDto;
    }
}
