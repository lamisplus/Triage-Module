package org.lamisplus.modules.triage.repository;

import com.foreach.across.modules.hibernate.jpa.repositories.CommonJpaRepository;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.lamisplus.modules.triage.domain.entity.VitalSign;
import org.springframework.data.jpa.repository.Query;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VitalSignRepository extends CommonJpaRepository<VitalSign, Long> {
    List<VitalSign> getVitalSignByArchivedAndFacilityId(Integer archived,Long facilityId);
    Optional<VitalSign> getVitalSignByVisitAndArchived(Visit visit, Integer archived);

    List<VitalSign> getVitalSignByPersonAndArchived(Person person, Integer archived);

    @Query(value ="SELECT * FROM triage_vital_sign WHERE last_modified_date > ?1 AND facility_id=?2 AND archived=?3", nativeQuery = true)
    public List<VitalSign> getVitalSignsDueForServerUpload(LocalDateTime dateLastSync, Long facilityId, int archived);

    List<VitalSign> findAllByFacilityIdAndArchived(Long facilityId, int archived);
}
