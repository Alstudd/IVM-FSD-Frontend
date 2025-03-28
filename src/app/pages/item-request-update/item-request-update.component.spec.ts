import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRequestUpdateComponent } from './item-request-update.component';

describe('ItemRequestUpdateComponent', () => {
  let component: ItemRequestUpdateComponent;
  let fixture: ComponentFixture<ItemRequestUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemRequestUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemRequestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
