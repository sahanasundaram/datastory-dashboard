// setupTests.ts
import '@testing-library/jest-dom';

import 'whatwg-fetch';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  global.ResizeObserver = ResizeObserver;