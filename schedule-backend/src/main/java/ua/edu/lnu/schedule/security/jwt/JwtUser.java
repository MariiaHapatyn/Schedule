package ua.edu.lnu.schedule.security.jwt;

import java.util.Collection;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class JwtUser implements UserDetails {
	private final Integer id;
	private final String username;
	private final String firstName;
	private final String middleName;
	private final String lastName;
	private final String password;
	private final Collection<? extends GrantedAuthority> authorities;
	private final Date lastPasswordReset;
	
	public JwtUser(
		Integer id,
		String username,
		String firstName,
		String middleName,
		String lastName,
		String password,
		Collection<? extends GrantedAuthority> authorities,
		Date lastPasswordReset) {
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.middleName = middleName;
		this.lastName = lastName;
		this.password = password;
		this.authorities = authorities;
		this.lastPasswordReset = lastPasswordReset;
	}
	
	public Integer getId() {
		return this.id;
	}
	
	@Override
	public String getUsername() {
		return this.username;
	}
	
	@JsonIgnore
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	
	@JsonIgnore
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	
	@JsonIgnore
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	public String getFirstName() {
		return this.firstName;
	}
	
	public String getMiddleName() {
		return this.middleName;
	}
	
	public String getLastName() {
		return lastName;
	}
	
	@JsonIgnore
	@Override
	public String getPassword() {
		return this.password;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.authorities;
	}
	
	@JsonIgnore
	@Override
	public boolean isEnabled() {
		return true;
	}
	
	@JsonIgnore
	public Date getLastPasswordReset() {
		return this.lastPasswordReset;
	}
}
