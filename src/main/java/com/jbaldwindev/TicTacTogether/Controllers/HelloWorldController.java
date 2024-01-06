package com.jbaldwindev.TicTacTogether.Controllers;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.bson.json.JsonObject;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 4800)
@RestController
@RequestMapping("/api/v1/")
public class HelloWorldController
{
    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @PostMapping("/move")
    public void move(@RequestBody String playerNum) {
        try {
            PlayerMove pMove = new ObjectMapper().readValue(playerNum, PlayerMove.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static class PlayerMove {
        public String playerNumber;
        public String spaceNumber;
    }
}
