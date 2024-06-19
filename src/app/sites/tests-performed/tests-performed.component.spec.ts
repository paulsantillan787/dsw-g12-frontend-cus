import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsPerformedComponent } from './tests-performed.component';

describe('TestsPerformedComponent', () => {
  let component: TestsPerformedComponent;
  let fixture: ComponentFixture<TestsPerformedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsPerformedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsPerformedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
