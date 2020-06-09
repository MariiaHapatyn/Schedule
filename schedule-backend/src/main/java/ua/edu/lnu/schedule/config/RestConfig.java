package ua.edu.lnu.schedule.config;

import java.time.DayOfWeek;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import ua.edu.lnu.schedule.infrastructure.DayOfWeekDeserializer;
import ua.edu.lnu.schedule.infrastructure.DayOfWeekSerializer;

@Configuration
public class RestConfig {
	
	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source =
			new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.addAllowedOrigin(CorsConfiguration.ALL);
		config.addAllowedHeader(CorsConfiguration.ALL);
		config.addExposedHeader("Location");
		config.addAllowedMethod("OPTIONS");
		config.addAllowedMethod("GET");
		config.addAllowedMethod("POST");
		config.addAllowedMethod("PUT");
		config.addAllowedMethod("DELETE");
		source.registerCorsConfiguration("/**", config);
		
		return new CorsFilter(source);
	}
	
	@Bean
	public Jackson2ObjectMapperBuilder jacksonBuilder() {
		return new Jackson2ObjectMapperBuilder()
			.serializerByType(DayOfWeek.class, new DayOfWeekSerializer())
			.deserializerByType(DayOfWeek.class, new DayOfWeekDeserializer());
	}
}
