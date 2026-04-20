import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 48,
    letterSpacing: -1.5,
  } as TextStyle,
  h1: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.8,
  } as TextStyle,
  h2: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.5,
  } as TextStyle,
  h3: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 23,
    letterSpacing: -0.4,
  } as TextStyle,
  body: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 23,
  } as TextStyle,
  bodyBold: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 23,
  } as TextStyle,
  bodySmall: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,
  caption: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: 0.3,
  } as TextStyle,
  label: {
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,
  button: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  } as TextStyle,
  score: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 56,
  } as TextStyle,
} as const;
