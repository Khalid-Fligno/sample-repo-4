import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WCExercisesComponent } from './wcExercises.component';

describe('WCExercisesComponent', () => {
  let component: WCExercisesComponent;
  let fixture: ComponentFixture<WCExercisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WCExercisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WCExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
