package demo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Salvo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private Integer turn ;


    @ElementCollection
    @Column(name="SalvoLocation")
    private List<String> salvoLocations = new ArrayList<>();


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;


    public Salvo() {}

    public Salvo(Integer turn, List<String> locations) {
        this.turn = turn;
        this.salvoLocations = locations;

    }
    public void addLocations(List<String> locations){

    }

    public void setGamePlayer(GamePlayer gamePlayer){
        this.gamePlayer  = gamePlayer;
    }
    public long getId(){
        return this.id;
    }

    public Integer getTurn(){
        return this.turn;
    }

    public List<String> getSalvoesLocations(){
        return this.salvoLocations;
    }

    @Override
    public String toString() {
        return this.turn.toString();
    }

    @JsonIgnore
    public GamePlayer getGamePlayer() {
        return this.gamePlayer;
    }
}
