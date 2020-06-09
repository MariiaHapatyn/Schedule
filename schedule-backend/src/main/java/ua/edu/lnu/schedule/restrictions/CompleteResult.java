package ua.edu.lnu.schedule.restrictions;

import javafx.util.Pair;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class CompleteResult implements Serializable {
    private double calculatedResult;
    Map<String, Pair<RestrictionCheckResult, String>> details;

    public CompleteResult(double calculatedResult, Map<String, Pair<RestrictionCheckResult, String>> details) {
        this.calculatedResult = calculatedResult;
        this.details = details;
    }

    public double getCalculatedResult() {
        return calculatedResult;
    }

    public void setCalculatedResult(double calculatedResult) {
        this.calculatedResult = calculatedResult;
    }

    public Map<String, Pair<RestrictionCheckResult, String>> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Pair<RestrictionCheckResult, String>> details) {
        this.details = details;
    }
}
