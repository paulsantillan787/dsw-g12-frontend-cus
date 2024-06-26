import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTestComponent } from './select-test.component';

describe('SelectTestComponent', () => {
  let component: SelectTestComponent;
  let fixture: ComponentFixture<SelectTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
