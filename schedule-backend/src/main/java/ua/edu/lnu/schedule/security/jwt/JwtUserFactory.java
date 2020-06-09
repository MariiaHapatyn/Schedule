package ua.edu.lnu.schedule.security.jwt;


import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import ua.edu.lnu.schedule.models.Authority;
import ua.edu.lnu.schedule.models.User;

public final class JwtUserFactory {
	
	private JwtUserFactory() {
	}
	
	public static JwtUser create(User user) {
		return new JwtUser(
			user.getId(),
			user.getUsername(),
			user.getFirstName(),
			user.getMiddleName(),
			user.getLastName(),
			user.getPassword(),
			mapToGrantedAuthorities(user.getAuthorities()),
			user.getLastPasswordReset());
	}
	
	private static Set<GrantedAuthority> mapToGrantedAuthorities(
		Set<Authority> authorities) {
		return authorities
			.stream()
			.map(authority -> new SimpleGrantedAuthority(authority.getName().name()))
			.collect(Collectors.toSet());
	}
}
