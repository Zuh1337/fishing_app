import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FishingCondition, FishingReport } from '../types/fishing';

type Props = {
  lat: number;
  lng: number;
  onSubmit: (report: FishingReport) => void;
};

const conditions: FishingCondition[] = ['excellent', 'good', 'fair', 'poor'];

export default function ReportComposer({ lat, lng, onSubmit }: Props) {
  const [userName, setUserName] = useState('');
  const [speciesCaught, setSpeciesCaught] = useState('');
  const [notes, setNotes] = useState('');
  const [condition, setCondition] = useState<FishingCondition>('good');

  const handlePost = () => {
    if (!userName.trim() || !speciesCaught.trim()) {
      return;
    }

    onSubmit({
      id: `${Date.now()}`,
      userName: userName.trim(),
      speciesCaught: speciesCaught.trim(),
      notes: notes.trim(),
      condition,
      lat,
      lng,
      timestampIso: new Date().toISOString(),
    });

    setSpeciesCaught('');
    setNotes('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drop a fishing update</Text>
      <TextInput
        placeholder="Your name"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
      />
      <TextInput
        placeholder="Species caught"
        value={speciesCaught}
        onChangeText={setSpeciesCaught}
        style={styles.input}
      />
      <TextInput
        placeholder="Conditions, bait, tide, etc."
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, styles.notes]}
        multiline
      />

      <View style={styles.conditionRow}>
        {conditions.map((item) => (
          <Pressable
            key={item}
            onPress={() => setCondition(item)}
            style={[styles.conditionChip, condition === item && styles.selectedChip]}
          >
            <Text style={styles.chipText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Post update</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D2D6DC',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F8FAFC',
  },
  notes: {
    minHeight: 68,
    textAlignVertical: 'top',
  },
  conditionRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  conditionChip: {
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  selectedChip: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    color: '#111827',
    textTransform: 'capitalize',
  },
  button: {
    backgroundColor: '#0C4A6E',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
