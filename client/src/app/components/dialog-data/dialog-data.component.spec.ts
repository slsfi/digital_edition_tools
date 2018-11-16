import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDataComponent } from './dialog-data.component';

describe('DialogProjectComponent', () => {
  let component: DialogDataComponent;
  let fixture: ComponentFixture<DialogDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
