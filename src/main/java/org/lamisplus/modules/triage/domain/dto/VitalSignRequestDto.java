package org.lamisplus.modules.triage.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.lamisplus.modules.patient.utility.LocalDateConverter;

import javax.persistence.Convert;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VitalSignRequestDto implements Serializable{
    private Long id;
    private Double bodyWeight;
    private Double diastolic;
    private String captureDate;
    private Double height;
    private Long personId;
    private Long visitId;
    private Double systolic;

    @NotNull
    @JsonIgnore
    private String uuid;
    private Double temperature;
    private Double pulse;
    private Double respiratoryRate;
    private Integer archived;
    @NotNull
    private Long facilityId;
}
