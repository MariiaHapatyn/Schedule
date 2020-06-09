package ua.edu.lnu.schedule.security.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
	private String tokenHeader;
	private UserDetailsService userDetailsService;
	private JwtTokenUtil jwtTokenUtil;
	
	@Value("${jwt.header}")
	public void setTokenHeader(String tokenHeader) {
		this.tokenHeader = tokenHeader;
	}
	
	@Autowired
	public void setUserDetailsService(UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}
	
	@Autowired
	public void setJwtTokenUtil(JwtTokenUtil jwtTokenUtil) {
		this.jwtTokenUtil = jwtTokenUtil;
	}
	
	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain chain)
		throws ServletException, IOException {
		String authToken = request.getHeader(this.tokenHeader);

		if(authToken != null && authToken.startsWith("Bearer ")) {
			authToken = authToken.substring(7);
		}
		
		String username = this.jwtTokenUtil.getUsernameFromToken(authToken);
		
		if (username != null &&
			SecurityContextHolder.getContext().getAuthentication() == null) {
			UserDetails userDetails =
				this.userDetailsService.loadUserByUsername(username);
			
			if (this.jwtTokenUtil.validateToken(authToken, userDetails)) {
				UsernamePasswordAuthenticationToken authentication =
					new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities());
				
				authentication.setDetails(
					new WebAuthenticationDetailsSource().buildDetails(request));
				
				SecurityContextHolder.getContext()
					.setAuthentication(authentication);
			}
		}
		
		chain.doFilter(request, response);
	}
}
