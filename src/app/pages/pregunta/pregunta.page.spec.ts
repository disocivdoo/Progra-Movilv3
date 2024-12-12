import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PreguntaPage } from './pregunta.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Para simular valores que pueden ser observables

describe('PreguntaPage', () => {
  let component: PreguntaPage;
  let fixture: ComponentFixture<PreguntaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreguntaPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: of({}) } } // Simula un paramMap vacío
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PreguntaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
