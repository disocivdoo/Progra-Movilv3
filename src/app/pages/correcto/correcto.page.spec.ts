import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CorrectoPage } from './correcto.page';


describe('CorrectoPage', () => {
  let component: CorrectoPage;
  let fixture: ComponentFixture<CorrectoPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CorrectoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
