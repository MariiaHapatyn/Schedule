package ua.edu.lnu.schedule.infrastructure;

import java.io.IOException;
import java.time.DayOfWeek;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class DayOfWeekSerializer extends JsonSerializer<DayOfWeek> {
	@Override
	public void serialize(
		DayOfWeek dayOfWeek,
		JsonGenerator jsonGenerator,
		SerializerProvider serializerProvider)
		throws IOException {
		String value = "";
		
		switch (dayOfWeek) {
			case MONDAY:
				value = "Понеділок";
				break;
			case TUESDAY:
				value = "Вівторок";
				break;
			case WEDNESDAY:
				value = "Середа";
				break;
			case THURSDAY:
				value = "Четвер";
				break;
			case FRIDAY:
				value = "П'ятниця";
				break;
			case SATURDAY:
				value = "Субота";
				break;
			case SUNDAY:
				value = "Неділя";
				break;
		}
		
		jsonGenerator.writeString(value);
	}
}
