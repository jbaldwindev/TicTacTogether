package com.jbaldwindev.TicTacTogether.Controllers;

import com.jbaldwindev.TicTacTogether.models.MoveData;
import com.jbaldwindev.TicTacTogether.models.RoomData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;
import com.jbaldwindev.TicTacTogether.services.RoomService;
import com.google.gson.*;
import java.util.ArrayList;
import java.util.Random;

@CrossOrigin(origins = "*", maxAge = 4800)
@RestController
@RequestMapping("/room/")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @PostMapping("/addRoom")
    public ResponseEntity<String> addRoom() {
        int newRoomID = roomService.CreateRoom();
        if (newRoomID > -1) {
            return new ResponseEntity<>(Integer.toString(newRoomID), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed to create room", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getrooms")
    public ResponseEntity<String> getRooms() {
        ArrayList<RoomData> roomList = roomService.getRoomDataList();
        ArrayList<RoomData> availableRoomList = new ArrayList<>();
        for (RoomData roomData : roomList) {
            if (!roomService.IsRoomInSession(roomData.getRoomID())) {
                availableRoomList.add(roomData);
            }
        }
        Gson gson = new Gson();
        String data = gson.toJson(availableRoomList);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("checkvalid/{roomId}")
    public ResponseEntity<Boolean> getRoomValidity(@PathVariable int roomId) {
        boolean isValid = roomService.IsValidRoom(roomId);
        System.out.println(isValid);
        return new ResponseEntity<>(isValid, HttpStatus.OK);
    }
}
