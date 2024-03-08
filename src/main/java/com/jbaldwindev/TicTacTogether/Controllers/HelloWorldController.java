package com.jbaldwindev.TicTacTogether.Controllers;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.jbaldwindev.TicTacTogether.models.MoveData;
import com.jbaldwindev.TicTacTogether.models.WinResponseData;
import com.jbaldwindev.TicTacTogether.services.GameService;
import com.jbaldwindev.TicTacTogether.services.RoomService;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 4800)
@RestController
@RequestMapping("/api/v1/")
public class HelloWorldController
{
    @Autowired
    private RoomService roomService;

    @Autowired
    private SimpMessagingTemplate template;

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @MessageMapping("/move/{room}")
    @SendTo("/topic/playermoved/{room}")
    public MoveData sendMove(@DestinationVariable int room, @Payload MoveData moveData) {
        System.out.println("the move has been received in some capacity");
        try {
            GameService game = roomService.GetGame(room);
            if (game.hasGameStarted() && (game.getPlayerTurn() == moveData.getUserId())) {
                game.FillSpace(moveData.getUserId(), moveData.getSpaceNumber());
                game.printBoard();
                return moveData;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        MoveData falseMoveData = new MoveData(-99,-99, -99);
        return moveData;
    }

    @MessageMapping("/addplayer/{room}/{username}")
    public void addPlayer(@DestinationVariable int room, @DestinationVariable String username) {
        GameService game = roomService.GetGame(room);
        int numPlayersJoined = game.AddPlayer(username);
        if (numPlayersJoined == 2) {
            String[] usernames = game.getUsernames();
            template.convertAndSend("/topic/playeradded/" + room + "/" + usernames[0], 1);
            template.convertAndSend("/topic/playeradded/" + room + "/" + usernames[1], 2);
        }
    }

    @MessageMapping("/startgame/{room}")
    @SendTo("/topic/gamestarted/{room}")
    public String startGameSocket(@DestinationVariable int room) {
        GameService game = roomService.GetGame(room);
        game.StartGame();
        return "gamestarted";
    }

    @MessageMapping("/resetgame/{room}")
    @SendTo("/topic/gamereset/{room}")
    public String resetSocket(@DestinationVariable int room) {
        GameService game = roomService.GetGame(room);
        game.RestartGame();
        return "reset";
    }

    @MessageMapping("/changeturn/{room}")
    @SendTo("/topic/turnchanged/{room}")
    public int changeTurn(@DestinationVariable int room) {
        GameService game = roomService.GetGame(room);
        game.ChangeTurn();
        game.turn += 1;
        return game.turn;
    }

    @MessageMapping("/checkwin/{room}")
    @SendTo("/topic/winstatus/{room}")
    public WinResponseData checkWin(@DestinationVariable int room, @Payload WinResponseData winResponseData) {
        GameService game = roomService.GetGame(room);
        WinResponseData updatedData = winResponseData;
        game.turnChangeIncrement += 1;
        updatedData.setTurnIncrement(updatedData.getTurnIncrement() + game.turnChangeIncrement);
        if (game.CheckWin()) {
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
