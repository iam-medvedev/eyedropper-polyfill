import { Pane } from 'tweakpane';
import { EyeDropperPolyfill } from '../src/eyedropper';
import { isEyeDropperSupported } from '../src/support';

const isSupported = isEyeDropperSupported();

function createSettings() {
  const PARAMS = {
    color: '#000000',
    enabled: true,
    pictures: 10,
  };

  const pane = new Pane({
    title: 'EyeDropper Polyfill',
    expanded: true,
  });
  pane.addBinding(PARAMS, 'enabled', {
    label: 'Enabled',
    disabled: !isSupported,
  });
  pane
    .addBinding(PARAMS, 'pictures', {
      label: 'Pictures',
      min: 1,
      max: 30,
      step: 1,
    })
    .on('change', (e) => {
      generatePictures(e.value);
    });

  pane.addBlade({ view: 'separator' });

  pane.addBinding(PARAMS, 'color', {
    label: 'Color',
    disabled: true,
    view: 'color',
  });
  pane
    .addButton({
      title: 'Get Color',
    })
    .on('click', async () => {
      const instance = PARAMS.enabled || !isSupported ? new EyeDropperPolyfill() : new window.EyeDropper();
      const result = await instance.open();
      PARAMS.color = result.sRGBHex;
      pane.refresh();
    });

  generatePictures(PARAMS.pictures);
}

function generatePictures(pictures: number) {
  const container = document.querySelector('main');
  if (!container) {
    throw new Error('Cannot generate pictures');
  }
  container.innerHTML = '';

  const width = 200;
  const height = 300;
  for (let i = 0; i < pictures; i++) {
    const id = i + 50;
    const url = `https://picsum.photos/id/${id}/${width}/${height}`;
    const img = document.createElement('img');
    img.src = url;
    container.appendChild(img);
  }
}

createSettings();
