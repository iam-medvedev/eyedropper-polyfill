import { describe, beforeEach, it, expect, vi } from 'vitest';
import { attachPolyfill } from '../attach';
import { px } from '../utils';

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

describe('EyeDropper Polyfill Browser Test', () => {
  beforeEach(() => {
    attachPolyfill();
  });

  it('should have EyeDropper constructor available', () => {
    expect(window.EyeDropper).toBeDefined();
    expect(typeof window.EyeDropper).toBe('function');
  });

  it('should create EyeDropper instance', () => {
    const eyeDropper = new window.EyeDropper();
    expect(eyeDropper).toBeInstanceOf(window.EyeDropper);
  });

  it('should have open method on EyeDropper instance', () => {
    const eyeDropper = new window.EyeDropper();
    expect(eyeDropper.open).toBeDefined();
    expect(typeof eyeDropper.open).toBe('function');
  });

  it('should handle EyeDropper.open() call properly', async () => {
    const eyeDropper = new window.EyeDropper();

    // Create a test element
    const color = '#ff0000';
    const top = 100;
    const left = 100;
    const element = document.createElement('button');
    element.textContent = 'Test';
    element.style.cssText = `
      position: fixed;
      top: ${px(top)};
      left: ${px(left)};
      padding: 20px;
      background: ${color};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    `;
    document.body.appendChild(element);

    // Test that open() returns a promise
    const openPromise = eyeDropper.open();
    expect(openPromise).toBeInstanceOf(Promise);

    await delay(100);

    // Simulate move then click
    const mouseMoveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: top + 10,
      clientY: left + 10,
    });
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: top + 10,
      clientY: left + 10,
    });

    window.dispatchEvent(mouseMoveEvent);
    await delay(100);
    window.dispatchEvent(clickEvent);

    const result = await openPromise;
    expect(result.sRGBHex).toEqual(color);
    document.body.removeChild(element);
  });

  it('should work with AbortController', async () => {
    const eyeDropper = new window.EyeDropper();
    const controller = new AbortController();

    const thenCb = vi.fn();
    const catchCb = vi.fn();
    eyeDropper.open({ signal: controller.signal }).then(thenCb).catch(catchCb);

    await delay(100);
    controller.abort();
    await delay(100);

    expect(catchCb).toBeCalled();
  });

  it('should handle multiple EyeDropper instances', () => {
    const eyeDropper1 = new window.EyeDropper();
    const eyeDropper2 = new window.EyeDropper();

    expect(eyeDropper1).toBeInstanceOf(window.EyeDropper);
    expect(eyeDropper2).toBeInstanceOf(window.EyeDropper);
    expect(eyeDropper1).not.toBe(eyeDropper2);
  });
});
