package com.jbaldwindev.TicTacTogether.Controllers;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.jbaldwindev.TicTacTogether.models.MoveData;
import com.jbaldwindev.TicTacTogether.models.WinResponseData;
import com.jbaldwindev.TicTacTogether.services.GameService;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 4800)
@RestController
@RequestMapping("/api/v1/")
public class HelloWorldController
{
    @Autowired
    private GameService gameService;
    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    private int turn = 0;
    private int winIncrement = 0;
    private int turnChangeIncrement = 0;

    @PostMapping("/move")
    public ResponseEntity<String> move(@RequestBody String playerNum) {
        try {
            PlayerMove pMove = new ObjectMapper().readValue(playerNum, PlayerMove.class);
            gameService.FillSpace(Integer.parseInt(pMove.playerNumber), Integer.parseInt(pMove.spaceNumber));
            if (gameService.CheckWin()) {
                gameService.RestartGame();
                return new ResponseEntity<>("win", HttpStatus.OK);

            } else {
                gameService.ChangeTurn();
                return new ResponseEntity<>("continue", HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("error", HttpStatus.BAD_REQUEST);
    }
    @PostMapping("/startgame")
    public void startGame() {
    }

    @PostMapping("/reset")
    public ResponseEntity<String> reset() {
        gameService.RestartGame();
        return new ResponseEntity<>("reset successful", HttpStatus.OK);
    }

    @MessageMapping("/move")
    @SendTo("/topic/playermoved")
    public MoveData sendMove(@Payload MoveData moveData) {
        try {
            if (gameService.hasGameStarted() && (gameService.getPlayerTurn() == moveData.getUserId())) {
                gameService.FillSpace(moveData.getUserId(), moveData.getSpaceNumber());
                gameService.printBoard();
                return moveData;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        MoveData falseMoveData = new MoveData(-99,-99);
        return moveData;
    }

    @MessageMapping("/addplayer")
    @SendTo("/topic/playeradded")
    public int addPlayer() {
        return gameService.AddPlayer();
    }

    @MessageMapping("/startgame")
    @SendTo("/topic/gamestarted")
    public String startGameSocket() {
        gameService.StartGame();
        return "gamestarted";
    }

    @MessageMapping("/resetgame")
    @SendTo("/topic/gamereset")
    public String resetSocket() {
        gameService.RestartGame();
        return "reset";
    }

    @MessageMapping("/changeturn")
    @SendTo("/topic/turnchanged")
    public int changeTurn() {
        gameService.ChangeTurn();
        turn += 1;
        return turn;
    }

    @MessageMapping("/checkwin")
    @SendTo("/topic/winstatus")
    public WinResponseData checkWin(@Payload WinResponseData winResponseData) {
        WinResponseData updatedData = winResponseData;
        turnChangeIncrement += 1;
        updatedData.setTurnIncrement(updatedData.getTurnIncrement() + turnChangeIncrement);
        if (gameService.CheckWin()) {
            //TODO remove
            System.out.println("sending a win message");
            updatedData.setWinResponse("win");
        } else {
            System.out.println("sending a continue message");
            updatedData.setWinResponse("continue");
        }
        return updatedData;
    }

    public static class PlayerMove {
        public String playerNumber;
        public String spaceNumber;
    }
}
