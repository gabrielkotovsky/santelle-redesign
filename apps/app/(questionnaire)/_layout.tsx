import { Stack } from 'expo-router';

export default function QuestionnaireLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="motivation" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="reaction-to-discomfort" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="infection-frequency" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="gynecologist-satisfaction" 
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

