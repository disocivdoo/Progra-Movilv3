import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EducationalLevel } from 'src/app/model/educational-level';
import { showToast } from 'src/app/tools/message-functions';
import { ProfileImageService } from 'src/app/services/profile-image.service';

@Component({
  selector: 'app-misdatos',
  standalone: true,
  templateUrl: './misdatos.component.html',
  styleUrls: ['./misdatos.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class MisDatosComponent implements OnInit {
  user: User = new User();
  listaNivelesEducacionales: EducationalLevel[] = [];

  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService,
    private profileImageService: ProfileImageService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadEducationalLevels();
  }

  async loadUserData(): Promise<void> {
    try {
      const username = this.authService.getCurrentUsername();
      if (username) {
        const currentUser = await this.databaseService.getUserByUsername(username);
        if (currentUser) {
          this.user = currentUser;
        } else {
          console.error('Usuario no encontrado');
        }
      } else {
        console.error('No se encontró un nombre de usuario autenticado');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario', error);
    }
  }

  loadEducationalLevels() {
    this.listaNivelesEducacionales = this.databaseService.loadEducationalLevels();
  }

  async actualizarDatos(): Promise<void> {
    if (this.user) {
      try {
        await this.databaseService.updateUser(this.user);
        showToast('Datos actualizados correctamente');
      } catch (error) {
        console.error('Error al actualizar los datos del usuario', error);
        showToast('Error al actualizar los datos');
      }
    }
  }

  navegarSinDatos(url: string): void {
    this.authService.logout();
  }

  isValidUser(): boolean {
    return (
      !!this.user.firstName &&
      !!this.user.email &&
      this.user.dateOfBirth instanceof Date &&
      !isNaN(this.user.dateOfBirth?.getTime())
    );
  }

  getProfileImage(): string {
    return this.profileImageService.getProfileImage(this.user.image);
  }

  onImageUrlChange(event: any): void {
    const url = event.detail.value;
    if (url && !this.profileImageService.getProfileImage(url)) {
      showToast('URL de imagen no válida. Se usará la imagen por defecto.');
      this.user.image = '';
    }
  }
}