package com.jbaldwindev.TicTacTogether.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class RoomData {
    int player1ID;
    int player2ID;
    int RoomID;
}
