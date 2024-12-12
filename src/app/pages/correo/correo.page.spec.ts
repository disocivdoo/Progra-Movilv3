import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CorreoPage } from './correo.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Para simular valores que pueden ser observables

describe('CorreoPage', () => {
  let component: CorreoPage;
  let fixture: ComponentFixture<CorreoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CorreoPage],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: of({}) } } // Simula el ActivatedRoute con un paramMap vacío
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CorreoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
