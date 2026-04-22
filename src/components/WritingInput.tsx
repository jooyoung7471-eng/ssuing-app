import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';

const MIN_CHARS = 10;
const MAX_CHARS = 120;

interface WritingInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
  onInputFocus?: () => void;
}

export default function WritingInput({
  value,
  onChangeText,
  onSubmit,
  loading,
  disabled,
  onInputFocus,
}: WritingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const canSubmit = value.length >= MIN_CHARS && !loading && !disabled;

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.sectionLabel}>MY ENGLISH</Text>

      {/* Input card */}
      <View style={[
        styles.inputCard,
        isFocused && styles.inputCardFocused,
        disabled && styles.inputCardDisabled,
      ]}>
        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          multiline
          placeholder="영어로 작문해보세요..."
          placeholderTextColor={colors.text.hint}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          textAlignVertical="top"
          blurOnSubmit
          onSubmitEditing={() => { if (canSubmit) onSubmit(); }}
          returnKeyType="done"
          onFocus={() => { setIsFocused(true); onInputFocus?.(); }}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {/* Footer: char count + submit button */}
      <View style={styles.footer}>
        <Text style={[
          styles.charCount,
          value.length >= MIN_CHARS && styles.charCountReady,
        ]}>
          {value.length} / {MAX_CHARS}
        </Text>
        <TouchableOpacity
          style={[styles.submitButton, canSubmit && styles.submitButtonActive]}
          onPress={onSubmit}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={[styles.submitText, canSubmit && styles.submitTextActive]}>
              {disabled ? '작문 완료' : '제출하기'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  } as any,
  inputCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: spacing.md,
  },
  inputCardFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
    ...shadows.sm,
  },
  inputCardDisabled: {
    opacity: 0.7,
    backgroundColor: colors.surfaceAlt,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    minHeight: 80,
    maxHeight: 150,
    lineHeight: 24,
  },
  inputDisabled: {
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  charCount: {
    ...typography.bodySmall,
    color: colors.text.hint,
  } as any,
  charCountReady: {
    color: colors.success,
  },
  submitButton: {
    backgroundColor: colors.disabled,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  submitButtonActive: {
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  submitText: {
    ...typography.button,
    color: colors.text.hint,
  } as any,
  submitTextActive: {
    color: colors.text.inverse,
  },
});
