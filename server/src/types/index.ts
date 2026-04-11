export interface HintWord {
  english: string;
  korean: string;
}

export interface CorrectionHighlight {
  original: string;
  corrected: string;
  reason: string;
}

export interface KeyExpression {
  english: string;
  korean: string;
  example: string;
}

export interface LLMCorrectionResult {
  correctedSentence: string;
  nativeExpressions: string[];
  explanation: string;
  keyExpression: KeyExpression;
  score: number;
  highlights: CorrectionHighlight[];
}

export interface JwtPayload {
  userId: string;
  email: string;
}

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
