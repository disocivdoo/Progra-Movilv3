import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { EducationalLevel } from 'src/app/model/educational-level';
import { User } from 'src/app/model/user';
import { ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage {
  public listaNivelesEducacionales = EducationalLevel.getLevels();
  public usuario: User;
  public respuesta: string = '';
  private correoUsuario: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private databaseService: DatabaseService
  ) {
    this.usuario = new User();
    this.obtenerPreguntaSeguridad();
  }

  async obtenerPreguntaSeguridad() {
    this.correoUsuario = this.router.getCurrentNavigation()?.extras.state?.['correo'];
    if (this.correoUsuario) {
      try {
        const usuario = await this.databaseService.findUserByEmail(this.correoUsuario);
        if (usuario) {
          this.usuario = usuario;
        } else {
          this.mostrarMensajeEmergente('Usuario no encontrado.');
          this.router.navigate(['/correo']);
        }
      } catch (error) {
        console.error("Error obteniendo la pregunta de seguridad:", error);
        this.mostrarMensajeEmergente('Ocurrió un error al obtener la pregunta de seguridad.');
      }
    } else {
      this.mostrarMensajeEmergente('Correo no especificado.');
      this.router.navigate(['/correo']);
    }
  }

  async enviarRespuesta() {
    if (!this.respuesta) {
      this.mostrarMensajeEmergente('Por favor, ingresa una respuesta.');
      return;
    }

    if (this.respuesta === this.usuario.secretAnswer) {
      this.mostrarMensajeEmergente('Respuesta correcta');
      const navigationExtras: NavigationExtras = {
        state: {
          correo: this.correoUsuario
        }
      };
      this.router.navigate(['/correcto'], navigationExtras);
    } else {
      this.mostrarMensajeEmergente('Respuesta Incorrecta');
      this.router.navigate(['/incorrecto']);
    }
  }

  async mostrarMensajeEmergente(mensaje: string, duracion: number = 2000) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }
}