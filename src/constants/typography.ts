import { TextStyle } from 'react-native';

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  } as TextStyle,
  h2: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  } as TextStyle,
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  } as TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  } as TextStyle,
  score: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
  } as TextStyle,
} as const;
