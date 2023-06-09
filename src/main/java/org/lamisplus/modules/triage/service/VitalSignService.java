package org.lamisplus.modules.triage.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.entities.User;
import org.lamisplus.modules.base.service.OrganisationUnitService;
import org.lamisplus.modules.base.service.UserService;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.patient.repository.PersonRepository;
import org.lamisplus.modules.patient.repository.VisitRepository;
import org.lamisplus.modules.triage.domain.dto.VitalSignDto;
import org.lamisplus.modules.triage.domain.dto.VitalSignRequestDto;
import org.lamisplus.modules.triage.domain.entity.VitalSign;
import org.lamisplus.modules.triage.repository.VitalSignRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
	
	private final VisitRepository visitRepository;
	
	private final UserService userService;
	
	
	public void archivedVitalSign(Long id) {
		VitalSign existingVitalSign = getExistingVitalSign(id);
		existingVitalSign.setArchived(1);
		vitalSignRepository.save(existingVitalSign);
	}
	
	
	public VitalSignDto registerVitalSign(VitalSignRequestDto vitalSignDto) {
		log.info("I am in service {}", vitalSignDto.getCaptureDate());
		Long personId = vitalSignDto.getPersonId();
		Person existingPerson = getExistingPerson(personId);
		Long visitId = vitalSignDto.getVisitId();
		if (visitId != null) {
			Optional<VitalSign> existVitalSignByVisitId = getExistVitalSignByVisitId(visitId);
			if (existVitalSignByVisitId.isPresent())
				throw new RecordExistException(VitalSign.class, "id", "" + visitId);
		}
		
		VitalSign vitalSign = convertVitalRequestSignDtoToVitalSignEntity(vitalSignDto);
		vitalSign.setUuid(UUID.randomUUID().toString());
		vitalSign.setArchived(0);
		vitalSign.setPerson(existingPerson);
		return convertVitalSignEntityToVitalSignDto(vitalSignRepository.save(vitalSign));
	}
	
	
	private Visit getVisit(Long visitId) {
		return visitRepository.findById(visitId).orElseThrow(() -> new EntityNotFoundException(Visit.class, "id", String.valueOf(visitId)));
	}
	
	
	private Optional<VitalSign> getExistVitalSignByVisitId(Long visitId) {
		Visit visit = getVisit(visitId);
		return vitalSignRepository.getVitalSignByVisitAndArchived(visit, 0);
	}
	
	public VitalSignDto getVitalSignByVisitId(Long visitId) {
		VitalSign vitalSign = getExistVitalSignByVisitId(visitId)
				.orElseThrow(() -> new EntityNotFoundException(VitalSign.class, "id", "" + visitId));
		return convertVitalSignEntityToVitalSignDto(vitalSign);
		
	}
	
	
	public VitalSignDto updateVitalSign(Long id, VitalSignRequestDto vitalSignDto) {
		VitalSign existingVitalSign = getExistingVitalSign(id);
		LocalDateTime visitStartDateTime = getLocalDateTime(vitalSignDto.getCaptureDate());
		existingVitalSign.setBodyWeight(vitalSignDto.getBodyWeight());
		existingVitalSign.setDiastolic(vitalSignDto.getDiastolic());
		existingVitalSign.setSystolic(vitalSignDto.getSystolic());
		existingVitalSign.setHeight(vitalSignDto.getHeight());
		existingVitalSign.setPulse(vitalSignDto.getPulse());
		existingVitalSign.setTemperature(vitalSignDto.getTemperature());
		existingVitalSign.setRespiratoryRate(vitalSignDto.getRespiratoryRate());
		existingVitalSign.setCaptureDate(visitStartDateTime);
		VitalSign updateVitalSign = vitalSignRepository.save(existingVitalSign);
		return convertVitalSignEntityToVitalSignDto(updateVitalSign);
	}
	
	
	public List<VitalSignDto> getVitalSign() {
		Optional<User> currentUser = this.userService.getUserWithRoles();
		Long currentOrganisationUnitId = 0L;
		if (currentUser.isPresent()) {
			User user = (User) currentUser.get();
			currentOrganisationUnitId = user.getCurrentOrganisationUnitId();

		}
		return vitalSignRepository.getVitalSignByArchivedAndFacilityId(0, currentOrganisationUnitId)
				.stream()
				.map(this::convertVitalSignEntityToVitalSignDto)
				.collect(Collectors.toList());
	}
	
	public VitalSignDto getVitalSignById(Long id) {
		return convertVitalSignEntityToVitalSignDto(getExistingVitalSign(id));
	}
	
	public List<VitalSignDto> getVitalSignByPersonId(Long personId) {
		Person existingPerson = getExistingPerson(personId);
		return vitalSignRepository.getVitalSignByPersonAndArchived(existingPerson, 0)
				.stream()
				.map(this::convertVitalSignEntityToVitalSignDto)
				.collect(Collectors.toList());
	}
	
	
	private VitalSign getExistingVitalSign(Long id) {
		return vitalSignRepository
				.findById(id)
				.orElseThrow(() -> new EntityNotFoundException(VitalSign.class, "id", "" + id));
	}
	
	private Person getExistingPerson(Long personId) {
		return personRepository
				.findById(personId)
				.orElseThrow(() -> new EntityNotFoundException(VitalSign.class, "id", "" + personId));
	}
	
	private VitalSign convertVitalSignDtoToVitalSignEntity(VitalSignDto vitalSignDto) {
		VitalSign vitalSign = new VitalSign();
		BeanUtils.copyProperties(vitalSignDto, vitalSign);
		Visit visit = getVisit(vitalSignDto.getVisitId());
		userService.getUserWithRoles().ifPresent(user -> vitalSign.setFacilityId(user.getCurrentOrganisationUnitId()));
		log.info("vital sign {}", vitalSign);
		vitalSign.setVisit(visit);
		return vitalSign;
	}
	
	private VitalSign convertVitalRequestSignDtoToVitalSignEntity(VitalSignRequestDto vitalSignDto) {
		VitalSign vitalSign = new VitalSign();
		if (vitalSignDto.getCaptureDate() != null) {
			LocalDateTime visitCaptureDateTime = getLocalDateTime(vitalSignDto.getCaptureDate());
			vitalSign.setCaptureDate(visitCaptureDateTime);
		} else {
			LocalDateTime now = LocalDateTime.now();
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
			String formatDateTime = now.format(formatter);
			LocalDateTime visitCaptureDateTime = LocalDateTime.parse(formatDateTime, formatter);
			vitalSign.setCaptureDate(visitCaptureDateTime);
		}
		BeanUtils.copyProperties(vitalSignDto, vitalSign);
		Visit visit = getVisit(vitalSignDto.getVisitId());
		userService.getUserWithRoles().ifPresent(user -> vitalSign.setFacilityId(user.getCurrentOrganisationUnitId()));
		vitalSign.setVisit(visit);
		return vitalSign;
	}
	
	@NotNull
	private static LocalDateTime getLocalDateTime(String captureDate) {
		if (captureDate.contains("T")) {
			String removeTime = captureDate.replace("T", " ");
			captureDate = removeTime.substring(0, removeTime.length() - 3);
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
		log.info("converted date to string: {}", captureDate);
		return LocalDateTime.parse(captureDate, formatter);
	}
	
	
	private VitalSignDto convertVitalSignEntityToVitalSignDto(VitalSign vitalSign) {
		VitalSignDto vitalSignDto = new VitalSignDto();
		BeanUtils.copyProperties(vitalSign, vitalSignDto);
		Visit visit = vitalSign.getVisit();
		vitalSignDto.setVisitId(visit.getId());
		vitalSignDto.setPersonId(vitalSign.getPerson().getId());
		LocalDate visitStartDate = vitalSign.getVisit().getVisitStartDate().toLocalDate();
		if (visitStartDate != null) {
			vitalSignDto.setVisitStartDate(visitStartDate);
		}
		return vitalSignDto;
	}
}
