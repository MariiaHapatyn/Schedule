package ua.edu.lnu.schedule.restrictions;

public class RestrictionCheckResult {
    private String restriction;
    private boolean checkPassed;
    private String message;
    private int result;
    private int violence;

    public RestrictionCheckResult(String restriction, boolean checkPassed, String message, int result, int violence) {
        this.restriction = restriction;
        this.checkPassed = checkPassed;
        this.message = message;
        this.result = result;
        this.violence = violence;
    }

    public RestrictionCheckResult(String restriction, boolean checkPassed, String message, int result) {
        this.restriction = restriction;
        this.checkPassed = checkPassed;
        this.message = message;
        this.result = result;
    }

    public int getResult() {
        return result;
    }

    public int getViolence() {
        return violence;
    }


    public String getRestriction() {
        return restriction;
    }

    public boolean isCheckPassed() {
        return checkPassed;
    }

    public String getMessage() {
        return message;
    }
}
