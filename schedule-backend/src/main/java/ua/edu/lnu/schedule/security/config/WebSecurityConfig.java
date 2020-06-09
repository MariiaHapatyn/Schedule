package ua.edu.lnu.schedule.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import ua.edu.lnu.schedule.security.jwt.JwtAuthenticationEntryPoint;
import ua.edu.lnu.schedule.security.jwt.JwtAuthenticationTokenFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	private JwtAuthenticationEntryPoint unauthorizedHandler;
	private UserDetailsService userDetailsService;
	
	@Autowired
	public void setUnauthorizedHandler(
		JwtAuthenticationEntryPoint unauthorizedHandler) {
		this.unauthorizedHandler = unauthorizedHandler;
	}
	
	@Autowired
	public void setUserDetailsService(UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}
	
	@Autowired
	public void configureAuthentication(
		AuthenticationManagerBuilder authenticationManagerBuilder)
		throws Exception {
		authenticationManagerBuilder
			.userDetailsService(this.userDetailsService)
			.passwordEncoder(this.passwordEncoder());
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public JwtAuthenticationTokenFilter authenticationTokenFilter()
		throws Exception {
		return new JwtAuthenticationTokenFilter();
	}
	
	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		httpSecurity
			.csrf().disable()
			.cors().and()
			.exceptionHandling()
				.authenticationEntryPoint(this.unauthorizedHandler)
				.and()
			.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and()
			.authorizeRequests()
				.antMatchers("/auth/**")
					.permitAll()
				.antMatchers("/users/current/**")
					.authenticated()
				
				.antMatchers(HttpMethod.GET, "/**")
					.permitAll()
				.antMatchers(HttpMethod.OPTIONS, "/**")
					.permitAll()
				
				.antMatchers(HttpMethod.POST, "/buildings/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.PUT, "/buildings/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.DELETE, "/buildings/**")
					.hasAuthority("ROLE_ADMIN")
				
				.antMatchers(HttpMethod.POST, "/classes/**")
					.hasAnyAuthority("ROLE_EDITOR")
				.antMatchers(HttpMethod.PUT, "/classes/**")
					.hasAuthority("ROLE_EDITOR")
				.antMatchers(HttpMethod.DELETE, "/classes/**")
					.hasAuthority("ROLE_EDITOR")
				
				.antMatchers(HttpMethod.POST, "/classrooms/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.PUT, "/classrooms/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.DELETE, "/classrooms/**")
					.hasAuthority("ROLE_ADMIN")
				
				.antMatchers(HttpMethod.POST, "/classroomTypes/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.PUT, "/classroomTypes/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.DELETE, "/classroomTypes/**")
					.hasAuthority("ROLE_ADMIN")
				
				.antMatchers(HttpMethod.POST, "/faculties/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.PUT, "/faculties/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.DELETE, "/faculties/**")
					.hasAuthority("ROLE_ADMIN")
				
				.antMatchers(HttpMethod.POST, "/groups/**")
					.hasAuthority("ROLE_EDITOR")
				.antMatchers(HttpMethod.PUT, "/groups/**")
					.hasAuthority("ROLE_EDITOR")
				.antMatchers(HttpMethod.DELETE, "/groups/**")
					.hasAuthority("ROLE_EDITOR")
				
				.antMatchers(HttpMethod.POST, "/plans/**")
					.hasAuthority("ROLE_EDITOR")
				.antMatchers(HttpMethod.PUT, "/plans/**")
					.hasAuthority("ROLE_EDITOR")
				.antMatchers(HttpMethod.DELETE, "/plans/**")
					.hasAuthority("ROLE_EDITOR")
				
				.antMatchers(HttpMethod.POST, "/subjects/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.PUT, "/subjects/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.DELETE, "/subjects/**")
					.hasAuthority("ROLE_ADMIN")
				
				.antMatchers(HttpMethod.POST, "/wishes/**")
					.hasAuthority("ROLE_LECTURER")
				.antMatchers(HttpMethod.PUT, "/wishes/**")
					.hasAuthority("ROLE_LECTURER")
				.antMatchers(HttpMethod.DELETE, "/wishes/**")
					.hasAuthority("ROLE_LECTURER")
				
				.antMatchers(HttpMethod.POST, "/users/**")
					.hasAuthority("ROLE_ADMIN")
				.antMatchers(HttpMethod.PUT, "/users/**")
					.authenticated()
				.antMatchers(HttpMethod.DELETE, "/users/**")
					.hasAuthority("ROLE_ADMIN")
				
				.anyRequest()
					.authenticated();
		
		httpSecurity.addFilterBefore(
			this.authenticationTokenFilter(),
			UsernamePasswordAuthenticationFilter.class);
		
		httpSecurity.headers().cacheControl();
	}
}
