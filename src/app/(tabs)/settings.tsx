import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const PRIVACY_URL = 'https://ssuing-app-production.up.railway.app/privacy';
const SUPPORT_EMAIL = 'ssuing.app@gmail.com';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* App info */}
        <View style={styles.section}>
          <View style={styles.item}>
            <Text style={styles.label}>버전</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => Linking.openURL(PRIVACY_URL)}
            activeOpacity={0.7}
          >
            <View style={styles.linkLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.text.primary} />
              <Text style={styles.label}>개인정보 처리방침</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.hint} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=[쓰잉] 문의`)}
            activeOpacity={0.7}
          >
            <View style={styles.linkLeft}>
              <Ionicons name="mail-outline" size={20} color={colors.text.primary} />
              <Text style={styles.label}>문의하기</Text>
            </View>
            <Text style={styles.emailText}>{SUPPORT_EMAIL}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
  },
  value: {
    ...typography.body,
    color: colors.text.secondary,
  },
  emailText: {
    ...typography.caption,
    color: colors.text.hint,
  },
});
