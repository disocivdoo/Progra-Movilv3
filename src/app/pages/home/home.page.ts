import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { QrWebScannerComponent } from 'src/app/components/qr-web-scanner/qr-web-scanner.component';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { MiClaseComponent } from 'src/app/components/miclase/miclase.component';
import { MisDatosComponent } from 'src/app/components/misdatos/misdatos.component';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TranslateModule, 
    IonContent,
    HeaderComponent, 
    FooterComponent, 
    MiClaseComponent, 
    MisDatosComponent,
    WelcomeComponent, 
    QrWebScannerComponent, 
    ForumComponent, 
    UsuariosComponent
  ]
})
export class HomePage {
  
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent: string = 'welcome';

  constructor(
    private auth: AuthService, 
    private scanner: ScannerService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    // Verificar si el usuario está autenticado antes de cargar la página
    const isAuthenticated = await this.auth.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirigir a la página de login
    } else {
      // Si está autenticado, continuar con la carga de la página
      this.selectedComponent = 'welcome';
      if (this.footer) {
        this.footer.selectedButton = 'welcome';
      }
    }
  }

  async headerClick(button: string) {
    if (!this.isAdmin() && button === 'scan' && Capacitor.getPlatform() === 'web') {
      this.selectedComponent = 'qrwebscanner';
      if (this.footer) {
        this.footer.selectedButton = 'scan';
      }
    }
  }

  webQrStopped() {
    this.changeComponent('welcome');
  }

  webQrScanned(data: any) {
    console.log('QR Scanned:', data);
  }

  footerClick(button: string) {
    // Asegurarse de que 'home' se traduzca a 'welcome'
    if (button === 'home') {
      this.selectedComponent = 'welcome';
      if (this.footer) {
        this.footer.selectedButton = 'welcome';
      }
    } else {
      this.selectedComponent = button;
    }
  }

  changeComponent(name: string) {
    // Asegurarse de que 'home' se traduzca a 'welcome'
    this.selectedComponent = name === 'home' ? 'welcome' : name;
    if (this.footer) {
      this.footer.selectedButton = name;
    }
  }

  isAdmin(): boolean {
    return this.auth.getCurrentUsername() === 'admin';
  }
}
