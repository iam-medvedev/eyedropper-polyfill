# `eyedropper-polyfill`

`eyedropper-polyfill` provides a polyfill implementation for the [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper), allowing you to capture colors from any part of a webpage.

This package is particularly useful for scenarios where the EyeDropper API is not natively [supported](https://caniuse.com/mdn-api_eyedropper) by the browser.

## Table of Contents

- [`eyedropper-polyfill`](#eyedropper-polyfill)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Opening the EyeDropper](#opening-the-eyedropper)
    - [Aborting](#aborting)
  - [License](#license)
  - [Contributing](#contributing)
  - [Acknowledgements](#acknowledgements)

## Features

- Provides a polyfilled implementation of the EyeDropper API for capturing colors from web pages.
- Supports selection of colors from different parts of the webpage.
- Offers a magnifier for precise color selection.
- Handles asynchronous operations and signal abortions.

## Installation

```bash
npm install eyedropper-polyfill
```

or

```bash
yarn add eyedropper-polyfill
```

## Usage

Import the `EyeDropperPolyfill` from the package:

```typescript
import 'eyedropper-polyfill';
```

It will create EyeDropper support via `window.EyeDropper`.

### Opening the EyeDropper

```typescript
const eyeDropper = new window.EyeDropper();

eyeDropper
  .open()
  .then((colorSelectionResult) => {
    // Use the selected color information
    console.log('Selected color:', colorSelectionResult.sRGBHex);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

### Aborting

```typescript
const eyeDropper = new window.EyeDropper();
const abortController = new window.AbortController();
const signal = abortController.signal;

// Set up an event listener to abort the operation after a certain time
setTimeout(() => {
  abortController.abort();
}, 5000); // Abort after 5 seconds

eyeDropper
  .open({ signal })
  .then((colorSelectionResult) => {
    // Use the selected color information
    console.log('Selected color:', colorSelectionResult.sRGBHex);
  })
  .catch((error) => {
    if (error.name === 'AbortError') {
      console.log('Operation was aborted.');
    } else {
      console.error('Error:', error);
    }
  });
```

## License

This package is distributed under the [MIT License](https://opensource.org/licenses/MIT).

## Contributing

Contributions are welcome! If you find any issues or have suggestions, please open an issue on the [GitHub repository](https://github.com/iam-medvedev/eyedropper-polyfill).

## Acknowledgements

This package was inspired by the EyeDropper API and the need for a consistent color selection mechanism across various browsers.
