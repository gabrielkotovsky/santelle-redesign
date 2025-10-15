// Utility function to build welcome copy based on test status
export function buildWelcomeCopy(daysSinceLastTest?: number | null): string {
  if (daysSinceLastTest === null || daysSinceLastTest === undefined) {
    return "Take your first test to get started!";
  }
  
  if (daysSinceLastTest === 0) {
    return "Your last test was today!";
  }
  
  return `${daysSinceLastTest} day${daysSinceLastTest === 1 ? '' : 's'} since your last test`;
}

