import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {
  constructor(private platform: Platform) {}

  isWebPlatform(): boolean {
    return this.platform.is('desktop') || this.platform.is('pwa');
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { camera } = await BarcodeScanner.checkPermissions();
      
      if (camera === 'granted') {
        return true;
      }

      const { camera: newStatus } = await BarcodeScanner.requestPermissions();
      return newStatus === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return false;
    }
  }

  async scanNative(): Promise<string | null> {
    try {
      const { barcodes } = await BarcodeScanner.scan();
      return barcodes.length > 0 ? barcodes[0].displayValue : null;
    } catch (error) {
      if (error instanceof Error && !error.message.includes('canceled')) {
        console.error('Error en escaneo nativo:', error);
      }
      return null;
    }
  }
}