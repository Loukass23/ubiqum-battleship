package demo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.*;


@Entity
public class Ship {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private String type ;
    private boolean horizontal ;
    private Integer size;
    private Integer hits;


    @ElementCollection
    @Column(name="ShipLocation")
    private List<String> locations = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;



    public Ship() {}

    public Ship(String type) {
        this.type = type;
    }
    public Ship(String type, List<String> location, boolean horizontal, Integer size) {
        this.type = type;
        this.locations = location;
        this.horizontal = horizontal;
        this.size = size;
        this.hits = 0;
    }
    public void setGamePlayer(GamePlayer gamePlayer){
        this.gamePlayer = gamePlayer;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public void setLocations(List<String> locations) {
        this.locations = locations;
    }

    public void setHorizontal(boolean horizontal) {
        this.horizontal = horizontal;
    }

    public boolean isHorizontal() {
        return horizontal;
    }

    public List<Object> isHit(Set<Salvo> salvo) {
        List<Object> hitsObj = new ArrayList<>();
        this.locations.stream().forEach(loc -> {
            salvo.stream().forEach(sal -> {
                Map<String, Object> hit = new HashMap<>();
               if( sal.getSalvoesLocations().contains(loc)){
                   hit.put("turn", sal.getTurn());
                   hit.put("hit", loc);

                  /* if (this.isSunk()){
                       hit.put("sunk", this.type);
                   }*/
                   hitsObj.add(hit);
            }});
        });
        return hitsObj;
    }
    public void setHits(Salvo salvo) {

        this.locations.stream().forEach(loc -> {
            if(salvo.getSalvoesLocations().contains(loc)){
              this.hits++;}
        });
    }

    public boolean isSunk(){
        return this.hits == this.size ? true : false;
    }

    public long getId(){
        return this.id;
    }
    public String getType(){
        return this.type;
    }

    public Integer getHits() {
        return hits;
    }

    public Integer getSize() {
        return size;
    }

    public List<String> getLocations(){
        return this.locations;
    }

    @Override
    public String toString() {
        return this.type;
    }

    @JsonIgnore
    public GamePlayer getGamePlayer() {
        return this.gamePlayer;
    }
}
