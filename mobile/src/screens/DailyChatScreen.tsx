import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';

type FormValues = {
  painLevel: number;
  fever: 'Yes' | 'No';
  redness: 'Yes' | 'No';
  discharge: 'Yes' | 'No';
};

export function DailyChatScreen() {
  const { control, setValue, watch, handleSubmit } = useForm<FormValues>({
    defaultValues: { painLevel: 3, fever: 'No', redness: 'No', discharge: 'No' }
  });

  const pain = watch('painLevel');

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text variant="titleMedium">Pain level (0–10)</Text>
      <Slider value={pain} onValueChange={(value) => setValue('painLevel', value)} minimumValue={0} maximumValue={10} step={1} />
      <Text>Selected pain level: {pain}</Text>
      <Controller
        control={control}
        name="fever"
        render={({ field }) => (
          <SegmentedButtons value={field.value} onValueChange={(v) => field.onChange(v as 'Yes' | 'No')} buttons={[{ value: 'Yes', label: 'Fever: Yes' }, { value: 'No', label: 'Fever: No' }]} />
        )}
      />
      <Controller
        control={control}
        name="redness"
        render={({ field }) => (
          <SegmentedButtons value={field.value} onValueChange={(v) => field.onChange(v as 'Yes' | 'No')} buttons={[{ value: 'Yes', label: 'Redness: Yes' }, { value: 'No', label: 'Redness: No' }]} />
        )}
      />
      <Controller
        control={control}
        name="discharge"
        render={({ field }) => (
          <SegmentedButtons
            value={field.value}
            onValueChange={(v) => field.onChange(v as 'Yes' | 'No')}
            buttons={[{ value: 'Yes', label: 'Discharge: Yes' }, { value: 'No', label: 'Discharge: No' }]}
          />
        )}
      />
      <View>
        <Button icon="camera" mode="outlined">Upload wound image</Button>
      </View>
      <Button mode="contained" onPress={handleSubmit(() => undefined)}>
        Analyze my recovery
      </Button>
    </ScrollView>
  );
}
