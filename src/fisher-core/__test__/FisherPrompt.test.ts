import { describe, expect, test, vi } from 'vitest';
import { FisherEquipmentItem, FisherEquipmentSlot } from '../fisher-item';
import { FisherPrompt } from '../fisher-prompt';

const testEquipmentData = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  price: 5,
  slots: [FisherEquipmentSlot.Helmet],
  requirements: [],
  attributes: [],
};

describe('FisherPrompt', () => {
  test('should add item to prompt quene', () => {
    vi.useFakeTimers();
    const prompt = new FisherPrompt();
    const equipment = new FisherEquipmentItem(testEquipmentData);
    prompt.promptItem(equipment, 2);
    expect(prompt.quene.length).toBe(1);
    expect(prompt.quene[0].item).toStrictEqual(equipment);
    expect(prompt.quene[0].quantity).toBe(2);
  });
});
