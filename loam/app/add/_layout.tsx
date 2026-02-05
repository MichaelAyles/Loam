import { Stack } from 'expo-router';
import { colors } from '../../theme';

export default function AddPlantLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Add Plant',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="variety"
        options={{
          title: 'Select Variety',
        }}
      />
      <Stack.Screen
        name="confirm"
        options={{
          title: 'Confirm Dates',
        }}
      />
    </Stack>
  );
}
