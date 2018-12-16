import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubjectComponent } from './dialog-subject.component';

describe('DialogSubjectComponent', () => {
  let component: DialogSubjectComponent;
  let fixture: ComponentFixture<DialogSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
