import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWorkComponent } from './dialog-work.component';

describe('DialogWorkComponent', () => {
  let component: DialogWorkComponent;
  let fixture: ComponentFixture<DialogWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
