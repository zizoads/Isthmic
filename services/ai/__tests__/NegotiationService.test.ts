
import { NegotiationService } from '../NegotiationService';
import { DealStateEnum, NegotiationMessage } from '../../../types';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Fix: Declare Jest globals to resolve "Cannot find name" errors when @types/jest is missing in the environment.
declare const describe: any;
declare const it: any;
declare const expect: any;

/**
 * TDD: Negotiation State Machine Logic Verification
 */
describe('NegotiationService.inferStateTransition', () => {
  const dummyHistory: NegotiationMessage[] = [
    { id: '1', sender: 'buyer', content: 'Is this domain for sale?', timestamp: '10:00 AM' }
  ];

  it('should infer INITIAL state for first contact messages', async () => {
    const currentMsg = "Hello, I am interested in buying your domain. How much are you asking?";
    
    const result = await NegotiationService.inferStateTransition(currentMsg, []);
    
    expect(result.newState).toBeDefined();
    expect(result.newState.currentState).toBe(DealStateEnum.INITIAL);
    expect(result.newState.confidenceScore).toBeGreaterThan(0.5);
    expect(typeof result.newState.transitionReason).toBe('string');
  });

  it('should infer TENSION state when price haggling occurs', async () => {
    const currentMsg = "Your price is too high. I can only offer $500. Take it or leave it.";
    
    const result = await NegotiationService.inferStateTransition(currentMsg, dummyHistory);
    
    expect(result.newState.currentState).toBe(DealStateEnum.TENSION);
    // Comment above fix: previousState exists in the DealState type now.
    expect(result.newState.previousState).toBeUndefined(); // Assuming no current state passed
  });

  it('should include a suggested action in the output', async () => {
    const currentMsg = "Let's move this to Escrow.com. What is your email address?";
    const result = await NegotiationService.inferStateTransition(currentMsg, dummyHistory);
    
    expect(result.suggestedAction).toBeDefined();
    expect(result.newState.currentState).toBe(DealStateEnum.CLOSING);
  });
});
