import { Stack } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { colors } from '../constants/colors';

const isWeb = Platform.OS === 'web';

// Web doesn't need GestureHandlerRootView — it causes crashes
let Wrapper: React.ComponentType<{ style?: any; children?: React.ReactNode }> = View;
if (!isWeb) {
  try {
    const { GestureHandlerRootView } = require('react-native-gesture-handler');
    Wrapper = GestureHandlerRootView;
  } catch {
    // fallback to View
  }
}

export default function RootLayout() {
  const content = (
    <Wrapper style={styles.root}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="practice/[theme]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="history/[id]"
          options={{
            headerTitle: '학습 상세',
            headerBackTitle: '돌아가기',
          }}
        />
        <Stack.Screen
          name="achievements"
          options={{
            headerTitle: '업적',
            headerBackTitle: '돌아가기',
          }}
        />
        <Stack.Screen
          name="weekly"
          options={{
            headerTitle: '주간 리포트',
            headerBackTitle: '돌아가기',
          }}
        />
        <Stack.Screen
          name="review"
          options={{
            headerTitle: '오답 복습',
            headerBackTitle: '돌아가기',
          }}
        />
      </Stack>
    </Wrapper>
  );

  if (!isWeb) return content;

  return (
    <View style={styles.webOuter}>
      <View style={styles.webFrame}>
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  webOuter: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
  },
  webFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
});
