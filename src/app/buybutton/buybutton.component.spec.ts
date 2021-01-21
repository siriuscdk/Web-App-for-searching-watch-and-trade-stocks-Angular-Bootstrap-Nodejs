import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuybuttonComponent } from './buybutton.component';

describe('BuybuttonComponent', () => {
  let component: BuybuttonComponent;
  let fixture: ComponentFixture<BuybuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuybuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuybuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
