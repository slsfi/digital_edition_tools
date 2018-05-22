import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolPublisherComponent } from './tool-publisher.component';

describe('ToolPublisherComponent', () => {
  let component: ToolPublisherComponent;
  let fixture: ComponentFixture<ToolPublisherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolPublisherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
