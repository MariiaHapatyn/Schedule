package ua.edu.lnu.schedule.security.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import ua.edu.lnu.schedule.models.Authority;
import ua.edu.lnu.schedule.models.User;
import ua.edu.lnu.schedule.repositories.AuthorityRepository;
import ua.edu.lnu.schedule.repositories.UserRepository;

@Service
public class UserServiceImpl implements UserService {
	private AuthorityRepository authorities;
	private UserRepository users;
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	public void setAuthorities(AuthorityRepository authorities) {
		this.authorities = authorities;
	}
	
	@Autowired
	public void setUsers(UserRepository users) {
		this.users = users;
	}
	
	@Autowired
	public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
		this.passwordEncoder = passwordEncoder;
	}
	
	@Override
	public void save(User user) {
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));
		user.setLastPasswordReset(new Date());
		
		this.users.save(user);
	}
	
	@Override
	public boolean changePassword(
		User user, String oldPassword, String newPassword) {
		if (!this.passwordEncoder.matches(oldPassword, user.getPassword())) {
			return false;
		}
		
		user.setPassword(this.passwordEncoder.encode(newPassword));
		user.setLastPasswordReset(new Date());
		
		this.users.save(user);
		return true;
	}
	
	@Override
	public void addUserToRole(User user, String roleName) {
		Authority.Name name = this.getAuthorityName(roleName);
		
		if (name == null) {
			return;
		}
		
		Authority authority = this.authorities.findByName(name);
		
		user.getAuthorities().add(authority);
	}
	
	@Override
	public void removeUserFromRole(User user, String roleName) {
		Authority.Name name = this.getAuthorityName(roleName);
		
		if (name == null) {
			return;
		}
		
		Authority authority = this.authorities.findByName(name);
		
		user.getAuthorities().remove(authority);
	}
	
	public Authority.Name getAuthorityName(String roleName) {
		Authority.Name name = null;
		
		switch (roleName.toLowerCase()) {
			case "lecturer":
				name = Authority.Name.ROLE_LECTURER;
				break;
			case "editor":
				name = Authority.Name.ROLE_EDITOR;
				break;
			case "admin":
				name = Authority.Name.ROLE_ADMIN;
				break;
		}
		
		return name;
	}
}
