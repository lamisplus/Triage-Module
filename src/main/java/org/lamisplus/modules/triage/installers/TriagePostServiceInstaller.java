package org.lamisplus.modules.triage.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(2)
@Installer(name = "post-service schema-installer",
        description = "Populate triage post services",
        version = 1)
public class TriagePostServiceInstaller  extends AcrossLiquibaseInstaller {

    public TriagePostServiceInstaller() {
        super ("classpath:installers/triage/schema/insert-service.xml");
    }
}
