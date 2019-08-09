package OpenDataApi.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String username;
    private String id;
    private int age;
    private Date createdAt;
    private String createdBy;
    private boolean locked;
}
