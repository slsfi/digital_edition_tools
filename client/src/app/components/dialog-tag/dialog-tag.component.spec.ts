import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTagComponent } from './dialog-tag.component';

describe('DialogTagComponent', () => {
  let component: DialogTagComponent;
  let fixture: ComponentFixture<DialogTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
