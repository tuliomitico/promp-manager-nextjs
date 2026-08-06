/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = webcrypto;
}

const refreshMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

expect.extend({});
