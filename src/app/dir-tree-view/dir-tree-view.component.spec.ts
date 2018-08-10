import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirTreeViewComponent } from './dir-tree-view.component';

describe('DirTreeViewComponent', () => {
  let component: DirTreeViewComponent;
  let fixture: ComponentFixture<DirTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirTreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
