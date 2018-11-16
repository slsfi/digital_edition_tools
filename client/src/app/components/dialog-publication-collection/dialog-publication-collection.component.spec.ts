import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPublicationCollectionComponent } from './dialog-publication-collection.component';

describe('DialogPublicationCollectionComponent', () => {
  let component: DialogPublicationCollectionComponent;
  let fixture: ComponentFixture<DialogPublicationCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPublicationCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPublicationCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
