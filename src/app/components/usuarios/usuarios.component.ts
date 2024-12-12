import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../model/user';
import { AuthService } from '../../services/auth.service';
import { showToast } from '../../tools/message-functions';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  currentUser: User | null = null;

  constructor(
    private databaseService: DatabaseService,
    private authService: AuthService
  ) {
    addIcons({ trashOutline });
  }

  ngOnInit() {
    this.loadUsers();
    this.getCurrentUser();
  }

  async loadUsers() {
    this.usuarios = await this.databaseService.readUsers();
  }

  async getCurrentUser() {
    const username = this.authService.getCurrentUsername();
    if (username) {
      const user = await this.databaseService.getUserByUsername(username);
      this.currentUser = user;
    }
  }

  async deleteUser(userName: string) {
    // Prevenir eliminación del admin
    if (userName === 'admin') {
      showToast('No se puede eliminar al administrador del sistema');
      return;
    }

    try {
      const success = await this.databaseService.deleteByUserName(userName);
      if (success) {
        showToast('Usuario eliminado correctamente');
        await this.loadUsers(); // Recargar la lista
      } else {
        showToast('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      showToast('Error al eliminar el usuario');
    }
  }

  isAdmin(): boolean {
    return this.currentUser?.userName === 'admin';
  }

  shouldShowDeleteButton(userName: string): boolean {
    return userName !== 'admin';
  }
}