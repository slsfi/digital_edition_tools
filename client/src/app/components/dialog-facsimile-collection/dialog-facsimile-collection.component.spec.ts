import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFacsimileCollectionComponent } from './dialog-facsimile-collection.component';

describe('DialogFacsimileCollectionComponent', () => {
  let component: DialogFacsimileCollectionComponent;
  let fixture: ComponentFixture<DialogFacsimileCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFacsimileCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFacsimileCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
