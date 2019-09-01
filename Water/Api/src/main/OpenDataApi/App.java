package OpenDataApi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@SpringBootApplication
@RestController
public class App {

    @GetMapping("/welcome")
    public String welcome(){
        return "Hello Spring Boot!";
    }
    public static void main(String[] args) throws Exception {
        SpringApplication.run(App.class, args);
    }
}
