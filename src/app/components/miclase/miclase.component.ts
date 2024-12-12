import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { Asistencia } from '../../model/asistencia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { addIcons } from 'ionicons';
import { 
  locationOutline, 
  bookOutline, 
  personOutline, 
  timeOutline,
  logOutOutline,
  location,
  book,
  person,
  time
} from 'ionicons/icons';

@Component({
  selector: 'app-miclase',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MiClaseComponent implements OnInit {
  sede!: string;
  idAsignatura!: string;
  seccion!: string;
  nombreAsignatura!: string;
  nombreProfesor!: string;
  dia!: string;
  bloqueInicio!: number;
  bloqueTermino!: number;
  horaInicio!: string;
  horaFin!: string;

  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ 
      locationOutline, 
      bookOutline, 
      personOutline, 
      timeOutline,
      logOutOutline,
      location,
      book,
      person,
      time
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const qrData = params['qrData'];
      if (qrData) {
        try {
          const parsedData = JSON.parse(qrData);
          this.updateClassData(parsedData);
          this.saveAttendance(parsedData);
        } catch (error) {
          console.error('Error al procesar el QR:', error);
        }
      } else {
        this.loadSavedAttendance();
      }
    });
  }

  private updateClassData(data: any) {
    this.sede = data.sede;
    this.idAsignatura = data.idAsignatura;
    this.seccion = data.seccion;
    this.nombreAsignatura = data.nombreAsignatura;
    this.nombreProfesor = data.nombreProfesor;
    this.dia = data.dia;
    this.bloqueInicio = Number(data.bloqueInicio);
    this.bloqueTermino = Number(data.bloqueTermino);
    this.horaInicio = data.horaInicio;
    this.horaFin = data.horaFin;
  }

  private async saveAttendance(data: any) {
    const attendance: Asistencia = {
      sede: data.sede,
      idAsignatura: data.idAsignatura,
      seccion: data.seccion,
      nombreAsignatura: data.nombreAsignatura,
      nombreProfesor: data.nombreProfesor,
      dia: data.dia,
      bloqueInicio: Number(data.bloqueInicio),
      bloqueTermino: Number(data.bloqueTermino),
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      setAsistencia: function () {
        console.log('Método setAsistencia ejecutado');
      }
    };

    sessionStorage.setItem('asistencia', JSON.stringify(attendance));
    
    try {
      await this.databaseService.saveAsistencia(attendance);
      console.log('Asistencia guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la asistencia:', error);
    }
  }

  private loadSavedAttendance() {
    const savedAttendance = sessionStorage.getItem('asistencia');
    if (savedAttendance) {
      const data = JSON.parse(savedAttendance);
      this.updateClassData(data);
    }
  }

  hayDatos(): boolean {
    return Boolean(this.sede || this.nombreAsignatura || this.nombreProfesor);
  }
}