package com.jbaldwindev.TicTacTogether.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

@AllArgsConstructor
@Data
@ToString
public class WinResponseData {
    private int userId;
    private String winResponse;
    private int turnIncrement;
}
