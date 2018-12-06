import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFacsimileComponent } from './dialog-facsimile.component';

describe('DialogFacsimileComponent', () => {
  let component: DialogFacsimileComponent;
  let fixture: ComponentFixture<DialogFacsimileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFacsimileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFacsimileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
