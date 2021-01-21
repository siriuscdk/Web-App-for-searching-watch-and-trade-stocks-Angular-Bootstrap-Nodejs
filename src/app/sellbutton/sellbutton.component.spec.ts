import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellbuttonComponent } from './sellbutton.component';

describe('SellbuttonComponent', () => {
  let component: SellbuttonComponent;
  let fixture: ComponentFixture<SellbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
