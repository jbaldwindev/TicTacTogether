package com.jbaldwindev.TicTacTogether.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

@AllArgsConstructor
@Data
@ToString
public class MoveData {
    private int userId;
    private int spaceNumber;
}
