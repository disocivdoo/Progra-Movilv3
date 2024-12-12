import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EducationalLevel } from 'src/app/model/educational-level';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
})
export class CorrectoPage implements OnInit {
  public listaNivelesEducacionales = EducationalLevel.getLevels();
  public usuario: User = new User();

  constructor(
    private router: Router,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.recibirPregunta();
  }

  async recibirPregunta() {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state) {
      const correo = nav.extras.state['correo'];
      if (correo) {
        try {
          const usuarioEncontrado = await this.databaseService.findUserByEmail(correo);
          if (usuarioEncontrado) {
            this.usuario = usuarioEncontrado;
          } else {
            this.router.navigate(['/correo']);
          }
        } catch (error) {
          console.error('Error al recuperar el usuario:', error);
          this.router.navigate(['/correo']);
        }
      }
    }
  }

  navegarSinDatos(pagina: string) {
    this.router.navigate([pagina]);
  }
}