package org.lamisplus.modules.triage.domain.entity;

import lombok.*;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;

@Entity
@Table(name = "triage_post_service")
@NoArgsConstructor
@Setter
@Getter
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class TriagePostService implements Persistable<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "module_service_code")
    private String moduleServiceCode;

    @Column(name = "module_service_name")
    private String moduleServiceName;

    @Column(name = "encounter_type")
    private String encounterType;

    @Override
    public boolean isNew() {
        return id == null;
    }
}

