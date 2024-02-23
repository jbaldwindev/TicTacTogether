package com.jbaldwindev.TicTacTogether.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class RoomData implements Serializable {
    int player1ID;
    int player2ID;
    int RoomID;
}
