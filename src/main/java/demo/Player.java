package demo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private String username;
    private String password;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<Score> scores = new HashSet<>();
    
    public Player() { }

    public Player(String username) {
        this.username = username;

    }
    public Player(String username, String password) {
        this.username = username;
        this.password = password;

    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }


    public String getUsername() {
        return username;
    }

    public String toString() {
        return username;
    }

    public long getId(){
        return this.id;
    }

    @JsonIgnore
    public List<Game> getGames() {
        return gamePlayers.stream().map(sub -> sub.getGame()).collect(toList());
    }
    public Score getScore(Game game){
        return this.scores.stream().filter(p -> p.getGame().equals(game)).findFirst().orElse(null);
    }
    @JsonIgnore
    public Set<Score> getScore(){
        return this.scores;
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }

}