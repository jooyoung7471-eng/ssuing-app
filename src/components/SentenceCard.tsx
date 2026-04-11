import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import HintWords from './HintWords';
import type { Sentence } from '../types';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface SentenceCardProps {
  sentence: Sentence;
  index: number;
  total: number;
}

export default function SentenceCard({ sentence, index, total }: SentenceCardProps) {
  const [vocabOpen, setVocabOpen] = useState(false);

  const toggleVocab = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setVocabOpen(!vocabOpen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>

      <View style={styles.korCard}>
        <Text style={styles.koreanText}>{sentence.koreanText}</Text>
      </View>

      <TouchableOpacity style={styles.vocabHeader} onPress={toggleVocab} activeOpacity={0.7}>
        <Text style={styles.vocabTitle}>KEY VOCABULARY</Text>
        <Ionicons
          name={vocabOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#374151"
        />
      </TouchableOpacity>
      {vocabOpen && (
        <View style={styles.vocabBody}>
          <HintWords hints={sentence.hintWords || []} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  korCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
    padding: 20,
    width: '100%',
    marginBottom: 12,
  },
  koreanText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 28,
  },
  vocabHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
  },
  vocabTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 1,
  },
  vocabBody: {
    width: '100%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.border,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    backgroundColor: colors.card,
    marginTop: -12,
    paddingTop: 20,
  },
});
