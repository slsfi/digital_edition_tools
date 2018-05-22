import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolMenusComponent } from './tool-menus.component';

describe('ToolMenusComponent', () => {
  let component: ToolMenusComponent;
  let fixture: ComponentFixture<ToolMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
