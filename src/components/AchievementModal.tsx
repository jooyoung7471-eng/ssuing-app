import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { colors } from '../constants/colors';

interface AchievementModalProps {
  visible: boolean;
  achievement: { type: string; title: string; emoji: string } | null;
  onClose: () => void;
}

export default function AchievementModal({
  visible,
  achievement,
  onClose,
}: AchievementModalProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!achievement) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View entering={FadeIn.duration(300)} style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(400).springify()} style={styles.modal}>
          <Text style={styles.emoji}>{achievement.emoji}</Text>
          <Text style={styles.title}>{achievement.title}</Text>
          <Text style={styles.congrats}>축하합니다!</Text>
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>닫기</Text>
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
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  congrats: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: 8,
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
