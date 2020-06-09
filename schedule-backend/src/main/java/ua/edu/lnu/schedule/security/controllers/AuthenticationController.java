package ua.edu.lnu.schedule.security.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mobile.device.Device;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.security.jwt.JwtAuthenticationRequest;
import ua.edu.lnu.schedule.security.jwt.JwtAuthenticationResponse;
import ua.edu.lnu.schedule.security.jwt.JwtTokenUtil;
import ua.edu.lnu.schedule.security.jwt.JwtUser;

@RestController
public class AuthenticationController {
	
	private String tokenHeader;
	private JwtTokenUtil jwtTokenUtil;
	private AuthenticationManager authenticationManager;
	private UserDetailsService userDetailsService;
	
	@Value("${jwt.header}")
	public void setTokenHeader(String tokenHeader) {
		this.tokenHeader = tokenHeader;
	}
	
	@Autowired
	public void setJwtTokenUtil(JwtTokenUtil jwtTokenUtil) {
		this.jwtTokenUtil = jwtTokenUtil;
	}
	
	@Autowired
	public void setAuthenticationManager(
		AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}
	
	@Autowired
	public void setUserDetailsService(UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}
	
	@PostMapping("${jwt.route.authentication.path}")
	public ResponseEntity<?> createAuthenticationToken(
		@RequestBody JwtAuthenticationRequest authenticationRequest,
		Device device)
		throws AuthenticationException {
		
		final Authentication authentication =
			this.authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
					authenticationRequest.getUsername(),
					authenticationRequest.getPassword()));
		
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		final UserDetails userDetails =
			this.userDetailsService.loadUserByUsername(
				authenticationRequest.getUsername());
		
		final String token = jwtTokenUtil.generateToken(userDetails, device);
		
		return ResponseEntity.ok(new JwtAuthenticationResponse(token));
	}
	
	@GetMapping("${jwt.route.authentication.refresh}")
	public ResponseEntity<?> refreshAndGetAuthenticationToken(
		HttpServletRequest request) {
		String token = request.getHeader(this.tokenHeader);
		String username = this.jwtTokenUtil.getUsernameFromToken(token);
		
		JwtUser user = (JwtUser)this.userDetailsService
			.loadUserByUsername(username);
		
		if (jwtTokenUtil.canTokenBeRefreshed(
			token, user.getLastPasswordReset())) {
			return ResponseEntity.ok(
				new JwtAuthenticationResponse(
					this.jwtTokenUtil.refreshToken(token)));
		} else {
			return ResponseEntity.badRequest().body(null);
		}
	}
}
