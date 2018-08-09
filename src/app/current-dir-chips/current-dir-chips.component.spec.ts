import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDirChipsComponent } from './current-dir-chips.component';

describe('CurrentDirChipsComponent', () => {
  let component: CurrentDirChipsComponent;
  let fixture: ComponentFixture<CurrentDirChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentDirChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentDirChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
