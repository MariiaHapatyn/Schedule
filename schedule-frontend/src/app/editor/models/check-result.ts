export interface RestrictionCheckResult {
	restriction: string;
    checkPassed: boolean;
	message: string;
	result: number;
}

export interface Pair {
	key: RestrictionCheckResult;
	value: string;
}

export interface CheckResult {
	calculatedResult: number;
	details: Map<string, Pair>;
}
