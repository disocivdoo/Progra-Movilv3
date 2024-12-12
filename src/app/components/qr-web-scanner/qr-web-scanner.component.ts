import { CommonModule } from '@angular/common';
import { Component, ElementRef, Output, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { stopCircleOutline, scanOutline, qrCodeOutline } from 'ionicons/icons';
import { QrScannerService } from '../../services/qr-scanner.service';

@Component({
  selector: 'app-qrwebscanner',
  templateUrl: './qr-web-scanner.component.html',
  styleUrls: ['./qr-web-scanner.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class QrWebScannerComponent implements OnInit, OnDestroy {
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @Output() scanned: EventEmitter<any> = new EventEmitter<any>();
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();

  public isWeb: boolean = true;
  public scannerMessage: string = '';
  public platformMessage: string = '';
  private mediaStream: MediaStream | null = null;

  constructor(
    private router: Router,
    private qrScannerService: QrScannerService
  ) {
    addIcons({ stopCircleOutline, scanOutline, qrCodeOutline });
  }

  ngOnInit() {
    this.isWeb = this.qrScannerService.isWebPlatform();
    this.platformMessage = this.isWeb
      ? 'Usando escáner web (navegador)'
      : 'Usando escáner nativo (dispositivo)';

    if (this.isWeb) {
      this.startQrScanningForWeb();
    }
  }

  async startQrScanningForWeb() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      this.video.nativeElement.srcObject = this.mediaStream;
      this.video.nativeElement.setAttribute('playsinline', 'true');
      this.video.nativeElement.play();
      this.scannerMessage = 'Escáner web iniciado';
      requestAnimationFrame(this.verifyVideo.bind(this));
    } catch (error) {
      this.scannerMessage = 'Error al iniciar la cámara web';
      console.error(error);
    }
  }

  async startNativeScanner() {
    console.log('Botón presionado'); // Confirmar evento
    try {
      const granted = await this.qrScannerService.requestPermissions();
      if (!granted) {
        this.scannerMessage = 'Permisos de cámara denegados';
        return;
      }

      const result = await this.qrScannerService.scanNative();
      if (result) {
        this.handleScannedData(result);
      } else {
        this.scannerMessage = 'No se detectó ningún código QR';
      }
    } catch (error) {
      this.scannerMessage = 'Error al escanear';
      console.error(error);
    }
  }

  private async verifyVideo() {
    if (this.video?.nativeElement?.readyState === this.video?.nativeElement?.HAVE_ENOUGH_DATA) {
      if (this.getQrData()) return;
      requestAnimationFrame(this.verifyVideo.bind(this));
    } else {
      requestAnimationFrame(this.verifyVideo.bind(this));
    }
  }

  private getQrData(): boolean {
    if (!this.canvas?.nativeElement) return false;

    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });

    if (qrCode && qrCode.data) {
      this.handleScannedData(qrCode.data);
      return true;
    }
    return false;
  }

  private handleScannedData(data: string) {
    this.scannerMessage = 'QR escaneado exitosamente';
    this.stopCamera();
    this.scanned.emit(data);
    this.router.navigate(['/miclase'], { queryParams: { qrData: data } });
  }

  stopQrScanning(): void {
    this.stopCamera();
    this.scannerMessage = 'Escáner detenido';
    this.stopped.emit();
  }

  private stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}