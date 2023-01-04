import { describe, expect, test, vi } from 'vitest';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { Prompt } from '../fisher-prompt';

const testEquipmentData = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  price: 5,
  slots: [EquipmentSlot.Helmet],
  requirements: [],
  attributes: [],
};

describe('Prompt', () => {
  test('should add item to prompt quene', () => {
    vi.useFakeTimers();
    const prompt = new Prompt();
    const equipment = new EquipmentItem(testEquipmentData);
    prompt.promptItem(equipment, 2);
    expect(prompt.quene.length).toBe(1);
    expect(prompt.quene[0].item).toStrictEqual(equipment);
    expect(prompt.quene[0].quantity).toBe(2);
  });
});
