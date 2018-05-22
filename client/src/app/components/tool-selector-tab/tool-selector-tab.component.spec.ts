import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolSelectorTabComponent } from './tool-selector-tab.component';

describe('ToolSelectorTabComponent', () => {
  let component: ToolSelectorTabComponent;
  let fixture: ComponentFixture<ToolSelectorTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolSelectorTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolSelectorTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
