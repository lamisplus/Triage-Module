package org.lamisplus.modules.triage.domain.entity;

import lombok.*;
import org.lamisplus.modules.patient.domain.entity.PatientAuditEntity;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.io.Serializable;
import java.time.LocalDate;

@Builder
@Entity
@Table(name = "triage_vital_sign")
@NoArgsConstructor
@Setter
@Getter
@AllArgsConstructor
@EqualsAndHashCode
public class VitalSign extends PatientAuditEntity implements Persistable<Long>, Serializable {
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
    @ManyToOne(optional = false)
    @JoinColumn(name = "person_uuid", nullable = false, referencedColumnName = "uuid")
    private Person person;
    private Long visitId;
    @NotNull
    private Double systolic;

    private Integer archived;
    @NotNull
    @Column(name = "uuid", nullable = false, unique = true, updatable = false)
    private String uuid;

    @Override
    public boolean isNew() {
        return id == null;
    }
}