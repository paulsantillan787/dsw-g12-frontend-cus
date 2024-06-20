import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VigilanceComponent } from './vigilance.component';

describe('VigilanceComponent', () => {
  let component: VigilanceComponent;
  let fixture: ComponentFixture<VigilanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VigilanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VigilanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
