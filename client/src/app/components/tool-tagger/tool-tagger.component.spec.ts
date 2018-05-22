import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTaggerComponent } from './tool-tagger.component';

describe('ToolTaggerComponent', () => {
  let component: ToolTaggerComponent;
  let fixture: ComponentFixture<ToolTaggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolTaggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
