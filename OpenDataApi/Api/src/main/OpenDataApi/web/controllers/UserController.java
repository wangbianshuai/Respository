package OpenDataApi.web.controllers;

import OpenDataApi.models.TestUser;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    private  static final  List<TestUser> users = new ArrayList<TestUser>(){{
        add(TestUser.builder().id("u-lucy").username("lucy").age(22).locked(false).build());
        add(TestUser.builder().id("u-tom").username("tom").age(23).locked(false).build());
        add(TestUser.builder().id("u-ming").username("ming").age(23).locked(false).build());
    }};

    @GetMapping("/users")
    public List<TestUser> getUsers(){
        return  users;
    }

    @GetMapping("/users/{username}")
    public TestUser getUser(@PathVariable String username){
        if(StringUtils.isEmpty(username)){
            return  null;
        }
        return  users.stream().filter(u->username.equals(u.getUsername())).findFirst().get();
    }
    @PutMapping("/users/{username}:locked")
    public void locked(@PathVariable String username ){
        Optional<TestUser> user = users.stream().filter(u->u.getUsername().equals(username)).findFirst();
        if(user.isPresent()){
            user.get().setLocked(true);
        }
    }
}


