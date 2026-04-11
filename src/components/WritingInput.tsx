import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/colors';

const MIN_CHARS = 10;

interface WritingInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function WritingInput({
  value,
  onChangeText,
  onSubmit,
  loading,
  disabled,
}: WritingInputProps) {
  const canSubmit = value.length >= MIN_CHARS && !loading && !disabled;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="영어로 작문해 보세요..."
          placeholderTextColor={colors.text.hint}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.charCount, value.length >= MIN_CHARS && styles.charCountReady]}>
          {value.length}자
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
              작문 완료
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
    padding: 16,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
    minHeight: 80,
    maxHeight: 150,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  charCount: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text.hint,
  },
  charCountReady: {
    color: colors.success,
  },
  submitButton: {
    backgroundColor: colors.disabled,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  submitButtonActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.hint,
  },
  submitTextActive: {
    color: '#FFFFFF',
  },
});
