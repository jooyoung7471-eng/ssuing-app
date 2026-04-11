import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import ScoreDisplay from './ScoreDisplay';
import { colors } from '../constants/colors';

interface CompletionModalProps {
  visible: boolean;
  themeTitle: string;
  averageScore: number;
  streakDays: number;
  totalXp?: number;
  currentLevel?: number;
  onClose: () => void;
}

export default function CompletionModal({
  visible,
  themeTitle,
  averageScore,
  streakDays,
  totalXp,
  currentLevel,
  onClose,
}: CompletionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View entering={FadeIn.duration(300)} style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(400).springify()} style={styles.modal}>
          <Text style={styles.emoji}>{'\u{1F389}'}</Text>
          <Text style={styles.title}>오늘의 {themeTitle} 완료!</Text>

          <ScoreDisplay score={averageScore} />

          {(totalXp != null && totalXp > 0) && (
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>획득 XP</Text>
              <Text style={styles.xpValue}>+{totalXp} XP</Text>
            </View>
          )}

          {currentLevel != null && (
            <View style={styles.levelRow}>
              <Text style={styles.levelLabel}>현재 레벨</Text>
              <Text style={styles.levelValue}>Lv. {currentLevel}</Text>
            </View>
          )}

          {streakDays > 0 && (
            <Text style={styles.streak}>
              {'\u{1F525}'} 연속 {streakDays}일째!
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  xpValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F59E0B',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  levelValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  streak: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
    marginTop: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.inverse,
  },
});
