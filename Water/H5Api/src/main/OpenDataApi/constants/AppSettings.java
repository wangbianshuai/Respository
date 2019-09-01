package OpenDataApi.constants;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Configuration
@Service
public class AppSettings {

    @Value("${OpenDataAccess.Data.ConnectionString}")
    public String ConnectionString;

    @Value("${OpenDataAccess.Data.DbUser}")
    public String DbUser;

    @Value("${OpenDataAccess.Data.DbPassword}")
    public String DbPassword;

    @Value("${OpenDataAccess.Data.ServerClient}")
    public String ServerClient;

    @Value("${OpenDataAccess.IsLog}")
    public String IsLog;

    static Properties props = null;

    static {
        try {
            props = PropertiesLoaderUtils.loadProperties(new ClassPathResource("application.properties"));
        } catch (Exception ex) {
        }
    }

    public static String GetConfig(String name) {
        if (props == null) return null;
        return props.getProperty(name);
    }
}
