package com.jbaldwindev.TicTacTogether.Controllers;

import com.jbaldwindev.TicTacTogether.models.MoveData;
import com.jbaldwindev.TicTacTogether.models.RoomData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jbaldwindev.TicTacTogether.services.RoomService;

import java.util.ArrayList;
import java.util.Random;

@CrossOrigin(origins = "*", maxAge = 4800)
@RestController
@RequestMapping("/room/")
public class RoomController {
    @Autowired
    private RoomService roomService;

    //TODO Generate an ID for the room
    //If ID is taken, go back to step one
    //If ID not take, add ID to list and send ID back to client
    @PostMapping("/addRoom")
    public ResponseEntity<String> addRoom() {
        int newRoomID = roomService.CreateRoom();
        if (newRoomID > -1) {
            return new ResponseEntity<>(Integer.toString(newRoomID), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to create room", HttpStatus.BAD_REQUEST);
        }
    }
}
