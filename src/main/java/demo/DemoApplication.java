package demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.web.context.WebApplicationContext;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class DemoApplication extends SpringBootServletInitializer {


	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRep,
									  GamePlayerRepository gamePlayerRep, ShipRepository shipRep,
									  SalvoRepository salvRep, ScoreRepository scoreRep ) {
		return (args) -> {


			Date date = new Date();
			Date date1h = Date.from(date.toInstant().plusSeconds(3600));
			Date date2h = Date.from(date.toInstant().plusSeconds(7200));



			Player p1 = new Player("Jack", "123");
			Player p2 = new Player("Brian","123" );
			Player p3 = new Player("Kim Bauer");
			Player p4 = new Player("Tony Almeida");
			p2.setPassword("123");
			Player p5 = new Player("Lucas", "123");
			playerRepository.save(p1);
			playerRepository.save(p2);
			playerRepository.save(p3);
			playerRepository.save(p4);
			playerRepository.save(p5);

			Game g1 = new Game(date);
			Game g2 = new Game(date1h);
			Game g3 = new Game(date2h);
			gameRep.save(g1);
			gameRep.save(g2);
			gameRep.save(g3);
/*
			//Ships Player 1
			List<String> shipLocation1 = new ArrayList<>();
			shipLocation1.add("H8");
			shipLocation1.add("H9");
			shipLocation1.add("H10");
			List<String> shipLocation2 = new ArrayList<>();
			shipLocation2.add("A6");
			shipLocation2.add("A7");
			shipLocation2.add("A8");
			shipLocation2.add("A9");
			List<String> shipLocation3 = new ArrayList<>();
			shipLocation3.add("C4");
			shipLocation3.add("D4");
			shipLocation3.add("E4");
			shipLocation3.add("F4");
			Ship s1 = new Ship("Destroyer",shipLocation1,true, 2);
			Ship s2 = new Ship("Submarine",shipLocation2,true, 3);
			Ship s3 = new Ship("Battleship",shipLocation3,false,4);
			GamePlayer gp1 = new GamePlayer(g1, p1);

			gamePlayerRep.save(gp1);
			gp1.addShip(s1);
			gp1.addShip(s2);
			gp1.addShip(s3);
			shipRep.save(s1);
			shipRep.save(s2);
			shipRep.save(s3);
			gamePlayerRep.save(gp1);
            //Ships Player 2
			List<String> shipLocation4 = new ArrayList<String>();
			shipLocation4.add("I8");
			shipLocation4.add("I9");
			shipLocation4.add("I10");
			List<String> shipLocation5 = new ArrayList<String>();
			shipLocation5.add("A1");
			shipLocation5.add("A2");
			shipLocation5.add("A3");
			shipLocation5.add("A4");
			List<String> shipLocation6 = new ArrayList<String>();
			shipLocation6.add("C4");
			shipLocation6.add("D4");
			shipLocation6.add("E4");
			shipLocation6.add("F4");
            Ship s4 = new Ship("Destroyer",shipLocation4, true,2);
            Ship s5 = new Ship("Submarine",shipLocation5,true,3);
            Ship s6 = new Ship("Carrier",shipLocation6,false,5);
			GamePlayer gp2 = new GamePlayer(g1, p5);


            gamePlayerRep.save(gp2);
			gp2.addShip(s4);
            gp2.addShip(s5);
            gp2.addShip(s6);
            shipRep.save(s4);
            shipRep.save(s5);
            shipRep.save(s6);
            gamePlayerRep.save(gp2);

			List<String> salvoLocation1 = new ArrayList<>();
			salvoLocation1.add("C4");
			salvoLocation1.add("D4");
			List<String> salvoLocation2 = new ArrayList<>();
			salvoLocation2.add("H8");
			salvoLocation2.add("F1");
			List<String> salvoLocation3 = new ArrayList<>();
			salvoLocation3.add("I10");
			salvoLocation3.add("A10");
			Salvo salv1 = new Salvo(1, salvoLocation1);
			Salvo salv2 = new Salvo(1, salvoLocation2);
			Salvo salv3 = new Salvo(2, salvoLocation3);
			gp2.addSalvo(salv2);
			gp1.addSalvo(salv1);
			salvRep.save(salv1);
			salvRep.save(salv2);
			gamePlayerRep.save(gp2);
			gamePlayerRep.save(gp1);

			gp1.addSalvo(salv3);
			salvRep.save(salv3);
			gamePlayerRep.save(gp1);

			Score scr1 = new Score(g1,p1, (double) 1);
			scoreRep.save(scr1);
			Score scr2 = new Score(g1,p2, (double) 0);
			scoreRep.save(scr2);
			Score scr3 = new Score(g2,p1, 0.5);
			scoreRep.save(scr3);*/
		};
	}
}

@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(inputName-> {
			Player player = playerRepository.findByUsername(inputName);
			if (player != null) {
				return new User(player.getUsername(), player.getPassword(),
						AuthorityUtils.createAuthorityList("USER"));
			} else {
				throw new UsernameNotFoundException("Unknown user: " + inputName);
			}
		});
	}

	@Autowired
	private PlayerRepository playerRepository;
	}


@EnableWebSecurity
@Configuration
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	private WebApplicationContext applicationContext;
	private WebSecurityConfiguration webSecurityConfiguration;
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
				.csrf().disable()
				.authorizeRequests()
                .antMatchers("/").permitAll()
				.antMatchers("/web/home*").permitAll()
				.antMatchers("/web/players*").permitAll()
				.antMatchers("/api/players").permitAll()
				.antMatchers("/api/game*").permitAll()
                .antMatchers("/api/login*").permitAll()
				.antMatchers("/web/game*").permitAll()
				.antMatchers("/api/games/players*").permitAll()
				.antMatchers("/web/game-view*").permitAll()
				.antMatchers("/**").hasAuthority("USER")
                .anyRequest().authenticated()
				.and()
				.formLogin()
				.usernameParameter("username")
				.passwordParameter("password")
				.loginPage("/api/login")
				.and()
				.logout()
				.logoutUrl("/api/logout");

		// if user is not authenticated, just send an authentication failure response
		http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if login is successful, just clear the flags asking for authentication
		http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

		// if login fails, just send an authentication failure response
		http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if logout is successful, just send a success response
		http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());
	}

	private void clearAuthenticationAttributes(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		}
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

}