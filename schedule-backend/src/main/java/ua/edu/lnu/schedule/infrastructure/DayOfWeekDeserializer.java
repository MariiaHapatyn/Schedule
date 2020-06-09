package ua.edu.lnu.schedule.infrastructure;

import java.io.IOException;
import java.time.DayOfWeek;
import java.util.Locale;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

public class DayOfWeekDeserializer extends JsonDeserializer<DayOfWeek> {
	@Override
	public DayOfWeek deserialize(
		JsonParser jsonParser,
		DeserializationContext deserializationContext)
		throws IOException {
		JsonNode node = jsonParser.getCodec().readTree(jsonParser);
		String value = node.asText();
		DayOfWeek result = null;
		
		switch (value.toLowerCase(Locale.forLanguageTag("uk-UA"))) {
			case "понеділок":
				result = DayOfWeek.MONDAY;
				break;
			case "вівторок":
				result = DayOfWeek.TUESDAY;
				break;
			case "середа":
				result = DayOfWeek.WEDNESDAY;
				break;
			case "четвер":
				result = DayOfWeek.THURSDAY;
				break;
			case "п'ятниця":
				result = DayOfWeek.FRIDAY;
				break;
			case "субота":
				result = DayOfWeek.SATURDAY;
				break;
			case "неділя":
				result = DayOfWeek.SUNDAY;
				break;
		}
		
		return result;
	}
}
