package org.lamisplus.modules.triage.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(1)
@Installer(name = "Triage-schema-installer",
        description = "Installs the required database tables",
        version = 1)
public class TriageInstaller extends AcrossLiquibaseInstaller {

    public TriageInstaller() {
        super ("classpath:installers/triage/schema/schema.xml");
    }
}
