import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SignUpLanguage } from '@/src/features/auth/auth.store';

const LANGUAGE_OPTIONS: readonly {
  value: SignUpLanguage;
  label: string;
}[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
];

type LanguageDropdownProps = {
  value: SignUpLanguage;
  onChange: (language: SignUpLanguage) => void;
};

export function LanguageDropdown({ value, onChange }: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = LANGUAGE_OPTIONS.find((option) => option.value === value) ?? LANGUAGE_OPTIONS[0];

  const selectLanguage = (language: SignUpLanguage) => {
    onChange(language);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen((open) => !open)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <Text style={styles.triggerText}>{selected.label}</Text>
        <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
      </Pressable>

      {isOpen && (
        <View style={styles.menu}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                accessibilityRole="menuitem"
                key={option.value}
                onPress={() => selectLanguage(option.value)}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
  },
  trigger: {
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(114, 20, 34, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    color: '#721422',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  chevron: {
    color: '#721422',
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
  },
  menu: {
    marginTop: 8,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(114, 20, 34, 0.2)',
    backgroundColor: 'rgba(255, 247, 240, 0.96)',
  },
  option: {
    minHeight: 46,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: 'rgba(114, 20, 34, 0.12)',
  },
  optionText: {
    color: '#721422',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  optionTextSelected: {
    fontFamily: 'Poppins-SemiBold',
  },
  checkmark: {
    color: '#721422',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
