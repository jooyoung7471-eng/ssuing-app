import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, radius, shadows } from '../constants/spacing';
import {
  enablePushNotifications,
  registerForPushNotifications,
} from '../services/notifications';

const TERMS_AGREED_KEY = 'terms_agreed';
const MARKETING_AGREED_KEY = 'marketing_agreed';
const PUSH_AGREED_KEY = 'push_agreed';

// --- Term items ---

interface TermItem {
  id: string;
  label: string;
  required: boolean;
  content: string;
}

const TERMS: TermItem[] = [
  {
    id: 'service',
    label: '\uC774\uC6A9\uC57D\uAD00',
    required: true,
    content: `\uC4F0\uC789 \uC774\uC6A9\uC57D\uAD00

\uC81C1\uC870 (\uBAA9\uC801)
\uC774 \uC57D\uAD00\uC740 \uC4F0\uC789(\uC774\uD558 "\uC11C\uBE44\uC2A4")\uC758 \uC774\uC6A9 \uC870\uAC74\uACFC \uC808\uCC28, \uC774\uC6A9\uC790\uC640 \uC11C\uBE44\uC2A4 \uC81C\uACF5\uC790\uC758 \uAD8C\uB9AC, \uC758\uBB34 \uBC0F \uCC45\uC784\uC0AC\uD56D\uC744 \uADDC\uC815\uD568\uC744 \uBAA9\uC801\uC73C\uB85C \uD569\uB2C8\uB2E4.

\uC81C2\uC870 (\uC11C\uBE44\uC2A4 \uC774\uC6A9)
1. \uC11C\uBE44\uC2A4\uB294 \uC601\uC5B4 \uC791\uBB38 \uD559\uC2B5\uC744 \uC704\uD55C \uBAA8\uBC14\uC77C \uC571\uC785\uB2C8\uB2E4.
2. \uC774\uC6A9\uC790\uB294 \uB9E4\uC77C \uC81C\uACF5\uB418\uB294 \uD55C\uAD6D\uC5B4 \uBB38\uC7A5\uC744 \uC601\uC5B4\uB85C \uC791\uBB38\uD558\uACE0, AI \uAE30\uBC18 \uAD50\uC815\uC744 \uBC1B\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.
3. \uC11C\uBE44\uC2A4\uB294 \uD559\uC2B5 \uAE30\uB85D, \uC2A4\uD2B8\uB9AD, \uC5C5\uC801 \uB4F1\uC758 \uAC8C\uC774\uBBF8\uD53C\uCF00\uC774\uC158 \uAE30\uB2A5\uC744 \uC81C\uACF5\uD569\uB2C8\uB2E4.

\uC81C3\uC870 (\uAE08\uC9C0 \uD589\uC704)
1. \uC11C\uBE44\uC2A4\uB97C \uC545\uC6A9\uD558\uAC70\uB098 \uBE44\uC815\uC0C1\uC801\uC778 \uBC29\uBC95\uC73C\uB85C \uC774\uC6A9\uD558\uB294 \uD589\uC704
2. \uD0C0\uC778\uC758 \uC815\uBCF4\uB97C \uB3C4\uC6A9\uD558\uB294 \uD589\uC704
3. \uC11C\uBE44\uC2A4\uC758 \uC548\uC815\uC801 \uC6B4\uC601\uC744 \uBC29\uD574\uD558\uB294 \uD589\uC704

\uC81C4\uC870 (\uBA74\uCC45 \uC870\uD56D)
1. AI \uAD50\uC815 \uACB0\uACFC\uB294 \uCC38\uACE0\uC6A9\uC774\uBA70, \uC644\uBCBD\uD55C \uC815\uD655\uC131\uC744 \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.
2. \uC11C\uBE44\uC2A4 \uC774\uC6A9 \uC911 \uBC1C\uC0DD\uD55C \uD559\uC2B5 \uACB0\uACFC\uC5D0 \uB300\uD574 \uC11C\uBE44\uC2A4 \uC81C\uACF5\uC790\uB294 \uCC45\uC784\uC744 \uC9C0\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.
3. \uCC9C\uC7AC\uC9C0\uBCC0, \uC11C\uBC84 \uC7A5\uC560 \uB4F1 \uBD88\uAC00\uD56D\uB825\uC5D0 \uC758\uD55C \uC11C\uBE44\uC2A4 \uC911\uB2E8\uC5D0 \uB300\uD574 \uCC45\uC784\uC744 \uC9C0\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.`,
  },
  {
    id: 'privacy',
    label: '\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68',
    required: true,
    content: `\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1 \uBC0F \uC774\uC6A9 \uB3D9\uC758

1. \uC218\uC9D1\uD558\uB294 \uAC1C\uC778\uC815\uBCF4 \uD56D\uBAA9
- \uC18C\uC15C \uB85C\uADF8\uC778: \uC774\uBA54\uC77C \uC8FC\uC18C, \uC774\uB984 (\uC120\uD0DD)
- \uC11C\uBE44\uC2A4 \uC774\uC6A9: \uC791\uBB38 \uB0B4\uC6A9, \uAD50\uC815 \uACB0\uACFC, \uD559\uC2B5 \uAE30\uB85D, \uC2A4\uD2B8\uB9AD \uC815\uBCF4
- \uAE30\uAE30 \uC815\uBCF4: \uAE30\uAE30 \uC2DD\uBCC4\uC790, \uC571 \uBC84\uC804, OS \uC815\uBCF4

2. \uC218\uC9D1 \uBC0F \uC774\uC6A9 \uBAA9\uC801
- \uC11C\uBE44\uC2A4 \uC81C\uACF5 \uBC0F \uD68C\uC6D0 \uAD00\uB9AC
- \uD559\uC2B5 \uC9C4\uB3C4 \uAD00\uB9AC \uBC0F \uD1B5\uACC4 \uC81C\uACF5
- AI \uAE30\uBC18 \uC601\uC5B4 \uC791\uBB38 \uAD50\uC815 \uC11C\uBE44\uC2A4 \uC81C\uACF5
- \uC11C\uBE44\uC2A4 \uAC1C\uC120 \uBC0F \uC0C8\uB85C\uC6B4 \uAE30\uB2A5 \uAC1C\uBC1C

3. \uBCF4\uAD00 \uAE30\uAC04
- \uD68C\uC6D0 \uD0C8\uD1F4 \uC2DC\uAE4C\uC9C0 \uBCF4\uAD00 \uD6C4 \uC989\uC2DC \uD30C\uAE30
- \uB2E8, \uAD00\uB828 \uBC95\uB839\uC5D0 \uB530\uB77C \uBCF4\uAD00\uC774 \uD544\uC694\uD55C \uACBD\uC6B0 \uD574\uB2F9 \uAE30\uAC04 \uB3D9\uC548 \uBCF4\uAD00

4. \uAC1C\uC778\uC815\uBCF4\uC758 \uD30C\uAE30
- \uBCF4\uAD00 \uAE30\uAC04 \uACBD\uACFC \uB610\uB294 \uCC98\uB9AC \uBAA9\uC801 \uB2EC\uC131 \uC2DC \uC989\uC2DC \uD30C\uAE30
- \uC804\uC790\uC801 \uD30C\uC77C \uD615\uD0DC: \uBCF5\uAD6C \uBD88\uAC00\uB2A5\uD55C \uBC29\uBC95\uC73C\uB85C \uC601\uAD6C \uC0AD\uC81C`,
  },
  {
    id: 'thirdparty',
    label: '\uB9CC 14\uC138 \uC774\uC0C1\uC785\uB2C8\uB2E4',
    required: true,
    content: `\uC81C3\uC790 \uC815\uBCF4 \uC81C\uACF5 \uB3D9\uC758

\uC4F0\uC789\uC740 AI \uAE30\uBC18 \uC601\uC5B4 \uC791\uBB38 \uAD50\uC815 \uC11C\uBE44\uC2A4\uB97C \uC81C\uACF5\uD558\uAE30 \uC704\uD574 \uC544\uB798\uC640 \uAC19\uC774 \uAC1C\uC778\uC815\uBCF4\uB97C \uC81C3\uC790\uC5D0\uAC8C \uC81C\uACF5\uD569\uB2C8\uB2E4.

1. \uC81C\uACF5\uBC1B\uB294 \uC790: Anthropic (Claude AI)
2. \uC81C\uACF5 \uBAA9\uC801: \uC601\uC5B4 \uC791\uBB38 \uAD50\uC815 \uBC0F \uD53C\uB4DC\uBC31 \uC0DD\uC131
3. \uC81C\uACF5 \uD56D\uBAA9: \uC774\uC6A9\uC790\uAC00 \uC785\uB825\uD55C \uC601\uC5B4 \uC791\uBB38 \uB0B4\uC6A9
4. \uBCF4\uC720 \uAE30\uAC04: \uAD50\uC815 \uCC98\uB9AC \uC644\uB8CC \uD6C4 \uC989\uC2DC \uD30C\uAE30

* \uC791\uBB38 \uB0B4\uC6A9\uC740 AI \uAD50\uC815\uC744 \uC704\uD574 Anthropic(Claude)\uC5D0 \uC804\uC1A1\uB429\uB2C8\uB2E4.
* Anthropic\uC758 \uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68\uC5D0 \uB530\uB77C \uB370\uC774\uD130\uAC00 \uCC98\uB9AC\uB429\uB2C8\uB2E4.
* \uC774\uC6A9\uC790\uC758 \uC774\uBA54\uC77C, \uC774\uB984 \uB4F1 \uAC1C\uC778 \uC2DD\uBCC4 \uC815\uBCF4\uB294 \uC804\uC1A1\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.`,
  },
  {
    id: 'marketing',
    label: '\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0',
    required: false,
    content: `\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0 \uB3D9\uC758 (\uC120\uD0DD)

1. \uC218\uC2E0 \uB0B4\uC6A9
- \uC0C8\uB85C\uC6B4 \uD559\uC2B5 \uCF58\uD150\uCE20 \uC5C5\uB370\uC774\uD2B8 \uC54C\uB9BC
- \uC774\uBCA4\uD2B8 \uBC0F \uD504\uB85C\uBAA8\uC158 \uC548\uB0B4
- \uC11C\uBE44\uC2A4 \uAC1C\uC120 \uC18C\uC2DD

2. \uC218\uC2E0 \uBC29\uBC95
- \uD478\uC2DC \uC54C\uB9BC, \uC774\uBA54\uC77C

3. \uC218\uC2E0 \uAC70\uBD80
- \uC124\uC815 \uD654\uBA74\uC5D0\uC11C \uC5B8\uC81C\uB4E0\uC9C0 \uC218\uC2E0\uC744 \uAC70\uBD80\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.
- \uC218\uC2E0 \uAC70\uBD80 \uC2DC \uB9C8\uCF00\uD305 \uAD00\uB828 \uC54C\uB9BC\uC774 \uB354 \uC774\uC0C1 \uBC1C\uC1A1\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.`,
  },
  {
    id: 'push',
    label: '\uD478\uC2DC \uC54C\uB9BC \uC218\uC2E0',
    required: false,
    content: `\uD478\uC2DC \uC54C\uB9BC \uC218\uC2E0 \uB3D9\uC758 (\uC120\uD0DD)

1. \uC54C\uB9BC \uB0B4\uC6A9
- \uB9E4\uC77C \uD559\uC2B5 \uB9AC\uB9C8\uC778\uB354 (\uC624\uC804 9\uC2DC)
- \uC2A4\uD2B8\uB9AD \uC720\uC9C0 \uC54C\uB9BC (\uC624\uD6C4 8\uC2DC, \uB2F9\uC77C \uD559\uC2B5 \uBBF8\uC644\uB8CC \uC2DC)
- \uC8FC\uAC04 \uB9AC\uD3EC\uD2B8 \uC54C\uB9BC

2. \uC54C\uB9BC \uAD00\uB9AC
- \uC124\uC815 \uD654\uBA74\uC5D0\uC11C \uC5B8\uC81C\uB4E0\uC9C0 \uC54C\uB9BC\uC744 \uB044\uAC70\uB098 \uC2DC\uAC04\uC744 \uBCC0\uACBD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.

3. \uAD8C\uD55C \uC694\uCCAD
- \uB3D9\uC758 \uC2DC \uAE30\uAE30\uC758 \uC54C\uB9BC \uAD8C\uD55C\uC744 \uC694\uCCAD\uD569\uB2C8\uB2E4.
- \uAE30\uAE30 \uC124\uC815\uC5D0\uC11C\uB3C4 \uC54C\uB9BC\uC744 \uAD00\uB9AC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`,
  },
];

// --- Component ---

export default function TermsScreen() {
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [modalContent, setModalContent] = useState<TermItem | null>(null);

  const allRequired = TERMS.filter((t) => t.required);
  const allRequiredChecked = allRequired.every((t) => checked[t.id]);
  const allChecked = TERMS.every((t) => checked[t.id]);

  const toggleItem = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      setChecked({});
    } else {
      const next: Record<string, boolean> = {};
      TERMS.forEach((t) => {
        next[t.id] = true;
      });
      setChecked(next);
    }
  }, [allChecked]);

  const handleAgree = async () => {
    // Save agreement
    await AsyncStorage.setItem(TERMS_AGREED_KEY, 'true');
    if (checked.marketing) {
      await AsyncStorage.setItem(MARKETING_AGREED_KEY, 'true');
    }
    if (checked.push) {
      await AsyncStorage.setItem(PUSH_AGREED_KEY, 'true');
      // Request push permission and schedule notifications
      await enablePushNotifications();
    }

    // Navigate to home
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{'\uC2DC\uC791\uD558\uAE30 \uC804\uC5D0'}</Text>
          <Text style={styles.headerSubtitle}>{'\uC57D\uAD00\uC744 \uD655\uC778\uD558\uACE0 \uB3D9\uC758\uD574\uC8FC\uC138\uC694.'}</Text>
        </View>

        {/* All agree card */}
        <TouchableOpacity
          style={styles.allAgreeCard}
          onPress={toggleAll}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, allChecked && styles.checkboxChecked]}>
            {allChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <View style={styles.allAgreeTextWrap}>
            <Text style={styles.allAgreeText}>{'\uC804\uCCB4 \uB3D9\uC758'}</Text>
            <Text style={styles.allAgreeSubtext}>{'\uC120\uD0DD \uD56D\uBAA9\uC744 \uD3EC\uD568\uD55C \uBAA8\uB4E0 \uC57D\uAD00'}</Text>
          </View>
        </TouchableOpacity>

        {/* Individual items */}
        <View style={styles.termsList}>
          {TERMS.map((term, index) => (
            <View
              key={term.id}
              style={[
                styles.termRow,
                index > 0 && styles.termRowBorder,
              ]}
            >
              <TouchableOpacity
                style={styles.termLeft}
                onPress={() => toggleItem(term.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.checkbox, checked[term.id] && styles.checkboxChecked]}
                >
                  {checked[term.id] && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.termLabelWrap}>
                  <Text
                    style={[
                      styles.termTag,
                      term.required ? styles.tagRequired : styles.tagOptional,
                    ]}
                  >
                    {term.required ? '\uD544\uC218' : '\uC120\uD0DD'}
                  </Text>
                  <Text style={styles.termLabel}>{term.label}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalContent(term)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.viewLink}>{'\uBCF4\uAE30'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.agreeButton, !allRequiredChecked && styles.agreeButtonDisabled]}
          onPress={handleAgree}
          activeOpacity={0.8}
          disabled={!allRequiredChecked}
        >
          <Text
            style={[
              styles.agreeButtonText,
              !allRequiredChecked && styles.agreeButtonTextDisabled,
            ]}
          >
            {'\uB3D9\uC758\uD558\uACE0 \uC2DC\uC791\uD558\uAE30'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content modal */}
      <Modal
        visible={!!modalContent}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalContent(null)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalContent?.label || ''}
            </Text>
            <TouchableOpacity
              onPress={() => setModalContent(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
          >
            <Text style={styles.modalBody}>{modalContent?.content || ''}</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  // Header
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.md,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: 6,
  },
  headerSubtitle: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
  },
  // All agree card
  allAgreeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primary + '30',
    marginBottom: spacing.md,
  },
  allAgreeTextWrap: {
    flex: 1,
  },
  allAgreeText: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  allAgreeSubtext: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  // Term list
  termsList: {
    paddingHorizontal: spacing.xxs,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  termRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  termLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  termLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    gap: 6,
  },
  termTag: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 6,
  },
  tagRequired: {
    color: colors.error,
  },
  tagOptional: {
    color: colors.text.secondary,
  },
  termLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontSize: 14,
  },
  viewLink: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  // Checkbox
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    borderWidth: 2,
    borderColor: colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  // Bottom
  bottomArea: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'web' ? spacing.xl : spacing.xs,
    backgroundColor: colors.background,
  },
  agreeButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  agreeButtonDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  agreeButtonText: {
    ...typography.button,
    color: '#FFFFFF',
  },
  agreeButtonTextDisabled: {
    color: colors.text.hint,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: spacing.lg,
  },
  modalBody: {
    ...typography.body,
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 22,
  },
});
