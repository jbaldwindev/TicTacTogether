package com.jbaldwindev.TicTacTogether.services;

import com.jbaldwindev.TicTacTogether.models.RoomData;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Random;

//TODO generate a room ID in here
@Service("roomService")
public class RoomService {
    ArrayList<RoomData> RoomDataList = new ArrayList<RoomData>();
    Random rand = new Random();

    public int CreateRoom() {
        if (RoomDataList.size() < 1000) {
            int newRoomID = rand.nextInt(1000);
            for (int i = 0; i < RoomDataList.size(); i++) {
                if (RoomDataList.get(i).getRoomID() == newRoomID) {
                    return CreateRoom();
                }
            }
            RoomData newRoom = new RoomData();
            newRoom.setRoomID(newRoomID);
            RoomDataList.add(newRoom);
            return newRoomID;
        } else {
            return -1;
        }
    }
}
