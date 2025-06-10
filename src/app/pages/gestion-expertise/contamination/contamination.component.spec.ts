import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaminationComponent } from './contamination.component';

describe('ContaminationComponent', () => {
  let component: ContaminationComponent;
  let fixture: ComponentFixture<ContaminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContaminationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
