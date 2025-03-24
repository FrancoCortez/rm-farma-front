import { Injectable } from '@angular/core';
import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';

@Injectable({
  providedIn: 'root',
})
export class ZebraPrintService {
  private zebraPrinter: ZebraBrowserPrintWrapper;

  constructor() {
    this.zebraPrinter = new ZebraBrowserPrintWrapper();
  }

  async getAvailablePrinters() {
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
    this.zebraPrinter.setPrinter(printer);
  }

  async print(zpl: string) {
    try {
      const response = await this.zebraPrinter.print(zpl);
      console.log('Print successful:', response);
    } catch (error) {
      console.error('Print error:', error);
      throw error;
    }
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
      // Adjust canvas size to match the image size
      canvas.width = image.width;
      canvas.height = image.height;

      // context.clearRect(0, 0, canvas.width, canvas.height);
      // context.drawImage(image, 0, 0, canvas.width, canvas.height);
      // URL.revokeObjectURL(url);
      context?.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }
}
