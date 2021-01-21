import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchllistComponent } from './watchllist.component';

describe('WatchllistComponent', () => {
  let component: WatchllistComponent;
  let fixture: ComponentFixture<WatchllistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchllistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchllistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
