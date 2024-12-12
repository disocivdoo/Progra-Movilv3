import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/model/user';
import { EducationalLevel } from 'src/app/model/educational-level';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { showToast } from 'src/app/tools/message-functions';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  educationalLevels: EducationalLevel[] = [];

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.educationalLevels = this.databaseService.loadEducationalLevels();
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      secretQuestion: ['', Validators.required],
      secretAnswer: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      educationalLevel: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      image: ['default-image.jpg']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;
      
      // Verificar si el usuario ya existe
      const existingUser = await this.databaseService.findUserByUserName(formValues.userName);
      if (existingUser) {
        showToast('El nombre de usuario ya está en uso');
        return;
      }

      // Verificar si el correo ya existe
      const existingEmail = await this.databaseService.findUserByEmail(formValues.email);
      if (existingEmail) {
        showToast('El correo electrónico ya está registrado');
        return;
      }

      const newUser = User.getNewUsuario(
        formValues.userName,
        formValues.email,
        formValues.password,
        formValues.secretQuestion,
        formValues.secretAnswer,
        formValues.firstName,
        formValues.lastName,
        this.educationalLevels.find(level => level.id === formValues.educationalLevel)!,
        new Date(formValues.dateOfBirth),
        formValues.address,
        formValues.image
      );

      try {
        await this.databaseService.saveUser(newUser);
        showToast('Usuario registrado exitosamente');
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        showToast('Error al registrar el usuario');
      }
    } else {
      showToast('Por favor, complete todos los campos correctamente');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}