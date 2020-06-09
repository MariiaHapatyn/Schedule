package ua.edu.lnu.schedule.models.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Semester {
	FIRST(1),
	SECOND(2);
	
	private final int number;
	
	Semester(int number) {
		this.number = number;
	}
	
	@JsonValue
	public int getNumber() {
		return number;
	}
	
	@JsonCreator
	public static Semester fromNumber(int number) {
		return number == 1
			? FIRST
			: number == 2
				? SECOND
				: null;
	}
}
