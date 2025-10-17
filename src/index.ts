/**
 * Voter Registration System
 * Main entry point for the application
 */

interface Voter {
  id: string;
  name: string;
  age: number;
  registered: boolean;
  registrationDate?: Date;
}

class VoterRegistrationSystem {
  private voters: Map<string, Voter> = new Map();

  /**
   * Register a new voter
   */
  registerVoter(voter: Omit<Voter, 'id' | 'registered' | 'registrationDate'>): Voter {
    const id = this.generateId();
    const newVoter: Voter = {
      ...voter,
      id,
      registered: true,
      registrationDate: new Date()
    };

    this.voters.set(id, newVoter);
    return newVoter;
  }

  /**
   * Get voter by ID
   */
  getVoter(id: string): Voter | undefined {
    return this.voters.get(id);
  }

  /**
   * Get all registered voters
   */
  getAllVoters(): Voter[] {
    return Array.from(this.voters.values());
  }

  /**
   * Check if voter is eligible to register
   */
  isEligibleToRegister(age: number): boolean {
    return age >= 18;
  }

  /**
   * Generate a unique ID for voters
   */
  private generateId(): string {
    return `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Example usage
function main(): void {
  console.log('Voter Registration System Started');
  
  const registrationSystem = new VoterRegistrationSystem();

  // Example voter registration
  const voter1 = registrationSystem.registerVoter({
    name: 'John Doe',
    age: 29
  });

  console.log('Registered voter:', voter1);
  console.log('Total voters:', registrationSystem.getAllVoters().length);
}

// Run the application
if (require.main === module) {
  main();
}

export { VoterRegistrationSystem, Voter };
