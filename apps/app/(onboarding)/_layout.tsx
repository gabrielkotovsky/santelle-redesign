import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="name" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="year" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="country" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
