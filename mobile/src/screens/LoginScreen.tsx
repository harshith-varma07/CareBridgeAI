import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store';

type LoginForm = { email: string; password: string; role: 'PATIENT' | 'DOCTOR' | 'ADMIN' };

export function LoginScreen() {
  const { control, handleSubmit, watch, setValue } = useForm<LoginForm>({
    defaultValues: { email: '', password: '', role: 'PATIENT' }
  });
  const dispatch = useDispatch();

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Controller control={control} name="email" render={({ field }) => <TextInput label="Email" value={field.value} onChangeText={field.onChange} />} />
      <Controller
        control={control}
        name="password"
        render={({ field }) => <TextInput label="Password" secureTextEntry value={field.value} onChangeText={field.onChange} />}
      />
      <SegmentedButtons
        value={watch('role')}
        onValueChange={(value) => setValue('role', value as LoginForm['role'])}
        buttons={[
          { value: 'PATIENT', label: 'Patient' },
          { value: 'DOCTOR', label: 'Doctor' },
          { value: 'ADMIN', label: 'Admin' }
        ]}
      />
      <Button mode="contained" onPress={handleSubmit((values) => dispatch(setAuth({ token: 'local-dev-token', role: values.role })))}>
        Login
      </Button>
    </View>
  );
}
