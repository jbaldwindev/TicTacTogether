package com.jbaldwindev.TicTacTogether.services;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

//SetBoard
//prompt space to fill
//fill space
//check win
//if win, EndGame
//else
//change turn
@Service("gameService")
public class GameService {
    private char[][] board = new char[3][3];
    private int playerTurn;
    private int winner;

    @PostConstruct
    public void InitGameService()
    {
        playerTurn = 1;
        SetBoard();
    }

    public void SetBoard() {
        this.board[0][0] = 'q';
        this.board[0][1] = 'w';
        this.board[0][2] = 'e';
        this.board[1][0] = 'r';
        this.board[1][1] = 't';
        this.board[1][2] = 'y';
        this.board[2][0] = 'u';
        this.board[2][1] = 'i';
        this.board[2][2] = 'p';
    }

    public void RestartGame() {
        SetBoard();
        playerTurn = 1;
    }

    public void FillSpace(int playerTurn, int row, int col) {
        switch (playerTurn) {
            case 1 -> this.board[row][col] = 'x';
            case 2 -> this.board[row][col] = 'o';
        }
    }

    public void FillSpace(int playerTurn, int spaceNum) {
        int row;
        int col;
        if (spaceNum < 4) {
            row = 1;
            col = spaceNum;
        } else if (spaceNum < 7) {
            row = 2;
            col = spaceNum - 3;
        } else {
            row = 3;
            col = spaceNum - 6;
        }
        row -= 1;
        col -= 1;
        switch (playerTurn) {
            case 1 -> this.board[row][col] = 'x';
            case 2 -> this.board[row][col] = 'o';
        }
    }

    public void ChangeTurn()
    {
        if (this.playerTurn == 1) {
            this.playerTurn = 2;
        } else {
            this.playerTurn = 1;
        }
    }

    public boolean CheckWin() {
        if ((this.board[0][0] == this.board[1][1] && this.board[0][0] == this.board[2][2]) ||
        (this.board[0][2] == this.board[1][1] && this.board[0][2] == this.board[2][0])) {
            return true;
        }

        boolean allSame = false;

        for (int i = 0; i < 3; i++)
        {
            //seeing if all characters in the row are the same
            allSame = true;
            char lastChar = this.board[i][0];
            for (int j = 1; j < 3; j++) {
                if (this.board[i][j] != lastChar) {
                    allSame = false;
                }
            }
            if (allSame) {
                return allSame;
            }

            //check if all characters in column are the same
            allSame = true;
            lastChar = this.board[0][i];
            for (int j = 1; j < 3; j++) {
                if (this.board[j][i] != lastChar) {
                    allSame = false;
                }
            }

            if (allSame) {
                return allSame;
            }
        }

        return allSame;
    }

    public void EndGame() {
        this.winner = this.playerTurn;
        System.out.println("Player " + this.winner + " wins");
    }
}
