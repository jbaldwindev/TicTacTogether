package com.jbaldwindev.TicTacTogether.services;

import com.jbaldwindev.TicTacTogether.models.RoomData;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

@Service("roomService")
public class RoomService {

    //TODO have list of rooms that are in session
    @Getter
    private ArrayList<RoomData> RoomDataList = new ArrayList<RoomData>();
    @Getter
    private ArrayList<Integer> RoomInSessionList = new ArrayList<>();
    private HashMap<Integer, GameService> RoomGameMap = new HashMap<Integer, GameService>();
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
            GameService newGame = new GameService();
            RoomGameMap.put(newRoomID, newGame);
            return newRoomID;
        } else {
            return -1;
        }
    }

    public GameService GetGame(int roomId) {
        GameService game = RoomGameMap.get(roomId);
        return game;
    }

    public boolean IsValidRoom(int roomToCheck) {
        return RoomGameMap.containsKey(roomToCheck);
    }

    public void AddRoomInSession(int roomId) {
        if (!RoomInSessionList.contains(roomId)) {
            RoomInSessionList.add(roomId);
        }
    }

    public boolean IsRoomInSession(int roomId) {
        return RoomInSessionList.contains(roomId);
    }

    public void AddSessionId(int roomId, String sessionId) {
        for (RoomData roomData : RoomDataList) {
            if (roomData.getRoomID() == roomId) {
                if (roomData.getSession1() == null) {
                    roomData.setSession1(sessionId);
                } else if (roomData.getSession2() == null) {
                    roomData.setSession2(sessionId);
                }
                break;
            }
        }
    }

    //TODO have this return a room or room id so the HelloWorldController can send
    //Maybe an arraylist with the users' usernames since that is what is used to send messages to specific users
    public String[] PlayerDisconnect(String sessionId) {
        for (RoomData roomData : RoomDataList) {
            if (roomData.getSession1() == sessionId || roomData.getSession2() == sessionId) {
                String[] usernames;
                GameService game = this.GetGame(roomData.getRoomID());
                usernames = game.getUsernames();
                if (RoomInSessionList.contains(roomData.getRoomID())) {
                    RoomInSessionList.remove(RoomInSessionList.indexOf(roomData.getRoomID()));
                }
                if (RoomGameMap.containsKey(roomData.getRoomID())) {
                    RoomGameMap.remove(roomData.getRoomID());
                }
                RoomDataList.remove(roomData);
                return usernames;
            }
        }
        return null;
    }
}
