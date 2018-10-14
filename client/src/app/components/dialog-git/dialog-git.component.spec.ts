import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGitComponent } from './dialog-git.component';

describe('DialogGitComponent', () => {
  let component: DialogGitComponent;
  let fixture: ComponentFixture<DialogGitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
