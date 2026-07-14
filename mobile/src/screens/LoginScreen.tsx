import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, Card, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store';
import { Screen } from '../components/Screen';

type LoginForm = { email: string; password: string; role: 'PATIENT' | 'DOCTOR' | 'ADMIN' };

const roleOptions = [
  { value: 'PATIENT', label: 'Patient' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'ADMIN', label: 'Admin' }
] as const;

export function LoginScreen() {
  const { control, handleSubmit, watch, setValue } = useForm<LoginForm>({
    defaultValues: { email: '', password: '', role: 'PATIENT' }
  });
  const dispatch = useDispatch();

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text variant="labelLarge" style={styles.kicker}>
          CareBridge AI
        </Text>
        <Text variant="headlineMedium" style={styles.title}>
          Recovery tracking that feels calm and clear.
        </Text>
        <Text style={styles.subtitle}>
          Secure daily check-ins, wound trend monitoring, and coordinated follow-up in one mobile workspace.
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.formHeader}>
            <Text variant="titleLarge">Sign in</Text>
            <Text style={styles.formSubtitle}>Use a role to preview the patient or clinician experience.</Text>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextInput
                label="Email"
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                left={<TextInput.Icon icon="email-outline" />}
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock-outline" />}
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />

          <SegmentedButtons
            value={watch('role')}
            onValueChange={(value) => setValue('role', value as LoginForm['role'])}
            buttons={roleOptions.map((option) => ({ value: option.value, label: option.label }))}
          />

          <Button
            mode="contained"
            contentStyle={styles.buttonContent}
            onPress={handleSubmit((values) => dispatch(setAuth({ token: 'local-dev-token', role: values.role })))}
          >
            Continue
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18
  },
  hero: {
    gap: 10,
    paddingTop: 4
  },
  kicker: {
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#1D4ED8'
  },
  title: {
    color: '#0F172A',
    fontWeight: '700'
  },
  subtitle: {
    color: '#475569',
    lineHeight: 22
  },
  card: {
    borderRadius: 24
  },
  cardContent: {
    gap: 16,
    paddingVertical: 20
  },
  formHeader: {
    gap: 4
  },
  formSubtitle: {
    color: '#64748B'
  },
  buttonContent: {
    paddingVertical: 6
  }
});
