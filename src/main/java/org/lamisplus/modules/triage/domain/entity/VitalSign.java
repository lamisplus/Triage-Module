package org.lamisplus.modules.triage.domain.entity;

import lombok.*;
import org.lamisplus.modules.patient.domain.entity.PatientAuditEntity;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Builder
@Entity
@Table(name = "vital_sign")
@NoArgsConstructor
@Setter
@Getter
@AllArgsConstructor
@EqualsAndHashCode
public class VitalSign extends PatientAuditEntity implements Persistable<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NotNull
    private Double bodyWeight;
    @NotNull
    private Double diastolic;
    @PastOrPresent
    @NotNull
    private LocalDate encounterDate;
    @NotNull
    private Double height;
    private Double temperature;
    private Double pulse;
    private Double respiratoryRate;
    @NotNull
    private Long personId;
    private Long visitId;
    @NotNull
    private Double systolic;

    private Integer archived;
    @NotNull
    @Column(name = "uuid", updatable = false, nullable = false)
    private String uuid;

    @Override
    public boolean isNew() {
        return id == null;
    }
}
