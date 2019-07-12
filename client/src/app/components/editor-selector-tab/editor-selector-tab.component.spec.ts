import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSelectorTabComponent } from './editor-selector-tab.component';

describe('EditorSelectorTabComponent', () => {
  let component: EditorSelectorTabComponent;
  let fixture: ComponentFixture<EditorSelectorTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSelectorTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSelectorTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
