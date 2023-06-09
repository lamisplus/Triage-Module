package org.lamisplus.modules.triage.domain.entity;

import lombok.*;
import org.lamisplus.modules.patient.domain.entity.PatientAuditEntity;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.lamisplus.modules.patient.domain.entity.Visit;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private Double bodyWeight;
    private Double diastolic;
    private LocalDateTime captureDate;
    private Double height;
    private Double temperature;
    private Double pulse;
    private Double respiratoryRate;
    @ManyToOne(optional = false)
    @JoinColumn(name = "person_uuid", nullable = false, referencedColumnName = "uuid")
    private Person person;

    @OneToOne(optional = false)
    @JoinColumn(name = "visit_id", nullable = false, referencedColumnName = "uuid")
    private Visit visit;

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
