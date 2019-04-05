package demo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.*;

@Entity
public class GamePlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    Date date;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id")
    private Game game;


    @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
    Set<Ship> ships = new HashSet<>();

    @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
    Set<Salvo> salvoes = new HashSet<>();

    private Integer turn ;
    boolean fleetReady;
    Integer shipsSunk;

    public GamePlayer() {
    }

    public GamePlayer(Game game, Player player ) {
        this.game = game;
        this.player = player;
        this.date = new Date();
        this.turn = 1;
        this.fleetReady = false;
    }

    public void addShip(Ship ship) {
        ship.setGamePlayer(this);
         ships.add(ship);
    }
    public void addSalvo(Salvo salvo) {
        salvo.setGamePlayer(this);
        salvoes.add(salvo);
    }

    public void setFleetReady() {
        if(this.ships.size() == 5) this.fleetReady = true;

    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public void incrementTurn() {
        this.turn++;
    }

    @Override
    public String toString() {
        return "gamePlayer:"+ this.id +" - Game: " + this.game + "- Player: " + this.player + this.ships;
    }

    public long getId(){
        return this.id;
    }

    public Game getGame() {
        return this.game;
    }

    public Player getPlayer() {
        return this.player;
    }

    public boolean isFleetReady() {
        return fleetReady;
    }

    public Set<Ship> getShips() {
        return ships;
    }

    public Set<Salvo> getSalvoes() {
        return salvoes;
    }

    @JsonIgnore
    public GamePlayer getOpponent(){
        Set<GamePlayer> gamePlayers = this.getGame().getGamePlayers();
        final GamePlayer[] opponent = new GamePlayer[1];
        gamePlayers.forEach(e -> {
            if(e.getId() != this.getId()){
                opponent[0] = e;
            }
        });
        return  opponent[0];
    }

    public Integer getTurn() {
        return turn;
    }
    public Integer getOpponentTurn() {
        return this.getOpponent().getTurn();
    }


    public Set<Salvo> getOpponentSalvoes(){
        GamePlayer opponant = this.getOpponent();
       return  opponant.getSalvoes();
    }


    public List<Object> getHits(){
       GamePlayer opponant = this.getOpponent();

        List<Object> shipsHit = new ArrayList<>();
       opponant.getShips().stream().forEach(ship -> {
           Map<String, Object> sunk = new HashMap<>();
                sunk.put("hit", ship.isHit(this.getSalvoes()));
           if (ship.isSunk()){
               sunk.put("type",ship.getType());}
               shipsHit.add(sunk);

       });
return  shipsHit;
    }
    @JsonIgnore
    public Score getScores(){
        Set<Score> score = this.getGame().getScore();
        final Score[] myScore = {new Score()};
        score.forEach(e -> {
            if(e.getPlayer() == this.player){
                myScore[0] = e;
            }
        });
        return myScore[0];
    }
}