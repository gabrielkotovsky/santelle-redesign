import { Stack } from 'expo-router';

export default function LogTestLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="questionnaire" 
        options={{
          title: 'Questionnaire',
        }}
      />
      <Stack.Screen 
        name="test" 
        options={{
          title: 'Test',
        }}
      />
      <Stack.Screen 
        name="recommendation" 
        options={{
          title: 'Recommendation',
        }}
      />
    </Stack>
  );
}
