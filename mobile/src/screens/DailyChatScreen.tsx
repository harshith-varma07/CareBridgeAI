import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, Card, SegmentedButtons, Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { Screen } from '../components/Screen';

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
  const RecoverySlider = Slider as unknown as React.ComponentType<{
    value: number;
    onValueChange: (value: number) => void;
    minimumValue: number;
    maximumValue: number;
    step: number;
  }>;

  return (
    <Screen>
      <Card style={styles.heroCard}>
        <Card.Content style={styles.heroContent}>
          <Text variant="labelLarge" style={styles.kicker}>
            Daily check-in
          </Text>
          <Text variant="headlineSmall" style={styles.heroTitle}>
            Share a quick symptom snapshot.
          </Text>
          <Text style={styles.heroSubtitle}>Answer a few questions and upload a photo so the care team can review your recovery trend.</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.fieldHeader}>
            <Text variant="titleMedium">Pain level</Text>
            <Text style={styles.painValue}>{pain}/10</Text>
          </View>
          <RecoverySlider value={pain} onValueChange={(value) => setValue('painLevel', value)} minimumValue={0} maximumValue={10} step={1} />
          <Text style={styles.helperText}>Use the slider to record your current pain level.</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleMedium">Symptoms</Text>
          <Controller
            control={control}
            name="fever"
            render={({ field }) => (
              <SegmentedButtons
                value={field.value}
                onValueChange={(v) => field.onChange(v as 'Yes' | 'No')}
                buttons={[{ value: 'Yes', label: 'Fever' }, { value: 'No', label: 'No fever' }]}
              />
            )}
          />
          <Controller
            control={control}
            name="redness"
            render={({ field }) => (
              <SegmentedButtons
                value={field.value}
                onValueChange={(v) => field.onChange(v as 'Yes' | 'No')}
                buttons={[{ value: 'Yes', label: 'Redness' }, { value: 'No', label: 'No redness' }]}
              />
            )}
          />
          <Controller
            control={control}
            name="discharge"
            render={({ field }) => (
              <SegmentedButtons
                value={field.value}
                onValueChange={(v) => field.onChange(v as 'Yes' | 'No')}
                buttons={[{ value: 'Yes', label: 'Discharge' }, { value: 'No', label: 'No discharge' }]}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleMedium">Wound image</Text>
          <Text style={styles.helperText}>Upload one clear photo in good lighting for the AI model.</Text>
          <Button icon="camera" mode="outlined">
            Upload wound image
          </Button>
        </Card.Content>
      </Card>

      <Button contentStyle={styles.submitButton} mode="contained" onPress={handleSubmit(() => undefined)}>
        Analyze my recovery
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 28
  },
  heroContent: {
    gap: 10,
    paddingVertical: 22
  },
  kicker: {
    color: '#1D4ED8',
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  heroTitle: {
    color: '#0F172A',
    fontWeight: '700'
  },
  heroSubtitle: {
    color: '#475569',
    lineHeight: 22
  },
  card: {
    borderRadius: 24
  },
  cardContent: {
    gap: 14,
    paddingVertical: 18
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  },
  painValue: {
    color: '#1D4ED8',
    fontWeight: '700'
  },
  helperText: {
    color: '#64748B',
    lineHeight: 20
  },
  submitButton: {
    paddingVertical: 6
  }
});
