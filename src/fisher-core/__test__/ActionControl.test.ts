/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { ActionControl } from '../fisher-skill';

const fisherCore = new FisherCore();
vi.stubGlobal('fisher', fisherCore);

const testActionId = 'Test:Action:Id';

describe('ActionControl', () => {
  test('should run callback when set active action id equal current action id', () => {
    const onActionStartMock = vi.fn();
    const onActionStopMock = vi.fn();
    const actionControl = new ActionControl({
      actionId: testActionId,
      onActionStart: onActionStartMock,
      onActionStop: onActionStopMock,
    });
    actionControl.setActionActive();
    expect(fisher.activeActionId).toBe(testActionId);
    expect(onActionStartMock).toBeCalled();
  });
});
