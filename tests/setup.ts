import { vi } from 'vitest';
import { transferableAbortController } from 'node:util';

// React Router uses Node's Request in jsdom. Match its AbortSignal realm.
const controller = transferableAbortController();
globalThis.AbortController = controller.constructor as typeof AbortController;
globalThis.AbortSignal = controller.signal.constructor as typeof AbortSignal;
vi.stubGlobal('scrollTo', vi.fn());
