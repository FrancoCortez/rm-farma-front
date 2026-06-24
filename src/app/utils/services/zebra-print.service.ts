import { Injectable } from '@angular/core';
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';
import { environment } from '../../../environments/environment';

export interface PrintResult {
  ok: boolean;
  attempts: number;
  error?: unknown;
  mock?: boolean;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

@Injectable({
  providedIn: 'root',
})
export class ZebraPrintService {
  private zebraPrinter: ZebraBrowserPrintWrapper;
  private lastPrintAt = 0;
  private readonly idleThresholdMs = environment.mockIdleThresholdMs;
  private readonly isMock = environment.mockPrint;

  constructor() {
    if (environment.production && this.isMock) {
      throw new Error(
        'ZebraPrintService: mockPrint must be false in production environment',
      );
    }
    this.zebraPrinter = new ZebraBrowserPrintWrapper();
    if (this.isMock) {
      console.warn(
        '[ZebraPrintService] MOCK mode active — real Zebra calls are disabled.',
      );
    }
  }

  async getAvailablePrinters() {
    if (this.isMock) {
      console.log('[ZebraPrintService] [MOCK] getAvailablePrinters → 1 impresora');
      return [{ name: 'MOCK-ZPL', connection: 'mock', deviceType: 'printer' }];
    }
    try {
      const printers = await this.zebraPrinter.getAvailablePrinters();
      console.log('Available printers:', printers);
      return printers;
    } catch (error) {
      console.error('Error finding printers:', error);
      throw error;
    }
  }

  setPrinter(printer: any) {
    if (this.isMock) {
      console.log('[ZebraPrintService] [MOCK] setPrinter →', printer?.name);
      return;
    }
    this.zebraPrinter.setPrinter(printer);
  }

  async print(zpl: string) {
    if (this.isMock) {
      await sleep(environment.mockPrintDelayMs);
      console.log('[ZebraPrintService] [MOCK] print head, length=', zpl.length);
      this.lastPrintAt = Date.now();
      return;
    }
    try {
      const response = await this.zebraPrinter.print(zpl);
      console.log('Print successful:', response);
      this.lastPrintAt = Date.now();
    } catch (error) {
      console.error('Print error:', error);
      throw error;
    }
  }

  async warmUpIfIdle(): Promise<void> {
    const now = Date.now();
    const isIdle =
      this.lastPrintAt === 0 || now - this.lastPrintAt > this.idleThresholdMs;
    if (this.isMock) {
      if (isIdle) {
        console.log(
          '[ZebraPrintService] [MOCK] warmUpIfIdle idle=true, simulando reconexión 150ms',
        );
        await sleep(150);
      } else {
        console.log('[ZebraPrintService] [MOCK] warmUpIfIdle idle=false, no-op');
      }
      return;
    }
    if (!isIdle) {
      return;
    }
    try {
      const printers = await this.zebraPrinter.getAvailablePrinters();
      if (!printers || printers.length === 0) {
        console.warn('[ZebraPrintService] warmUpIfIdle: no printers found');
        return;
      }
      this.zebraPrinter.setPrinter(printers[0]);
      await sleep(150);
      console.log('[ZebraPrintService] warmUpIfIdle: re-acquired printer');
    } catch (error) {
      console.error('[ZebraPrintService] warmUpIfIdle failed:', error);
    }
  }

  async printWithRetry(
    zpl: string,
    opts: { maxRetries?: number; baseDelayMs?: number } = {},
  ): Promise<PrintResult> {
    const maxRetries = opts.maxRetries ?? 3;
    const baseDelayMs = opts.baseDelayMs ?? 200;

    if (this.isMock) {
      let attempts = 0;
      let lastError: unknown;
      for (let i = 0; i < maxRetries; i++) {
        attempts++;
        await sleep(environment.mockPrintDelayMs);
        const fail = Math.random() < environment.mockPrintFailureRate;
        if (fail) {
          lastError = new Error('mock failure');
          console.log(
            `[ZebraPrintService] [MOCK] print attempt ${attempts}/${maxRetries} → FAIL`,
          );
          if (i < maxRetries - 1) {
            await sleep(baseDelayMs * Math.pow(2, i));
          }
          continue;
        }
        console.log(
          `[ZebraPrintService] [MOCK] print attempt ${attempts}/${maxRetries} → OK`,
        );
        this.lastPrintAt = Date.now();
        return { ok: true, attempts, mock: true };
      }
      return { ok: false, attempts, error: lastError, mock: true };
    }

    let attempts = 0;
    let lastError: unknown;
    for (let i = 0; i < maxRetries; i++) {
      attempts++;
      try {
        const response = await this.zebraPrinter.print(zpl);
        console.log('Print successful:', response);
        this.lastPrintAt = Date.now();
        return { ok: true, attempts };
      } catch (error) {
        lastError = error;
        console.error(
          `[ZebraPrintService] print attempt ${attempts}/${maxRetries} failed:`,
          error,
        );
        if (i < maxRetries - 1) {
          await sleep(baseDelayMs * Math.pow(2, i));
        }
      }
    }
    return { ok: false, attempts, error: lastError };
  }

  async previewLabel(zpl: string, canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context not found');
    }
    const zplToImageUrl = `https://api.labelary.com/v1/printers/8dpmm/labels/3.937x3.937/0/${encodeURIComponent(zpl)}`;
    const response = await fetch(zplToImageUrl, {
      headers: {
        Accept: 'image/png',
      },
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context?.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }
}
