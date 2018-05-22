import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolFacsimilesComponent } from './tool-facsimiles.component';

describe('ToolFacsimilesComponent', () => {
  let component: ToolFacsimilesComponent;
  let fixture: ComponentFixture<ToolFacsimilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolFacsimilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolFacsimilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
