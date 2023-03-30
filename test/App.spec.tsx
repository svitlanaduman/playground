import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';
import {Missions} from '../src/index';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount, page }) => {
  const component = await mount(<Missions />);
  await expect(component).toContainText('Learn React');
});