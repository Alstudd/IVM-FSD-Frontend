import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRequestListComponent } from './item-request-list.component';

describe('ItemRequestListComponent', () => {
  let component: ItemRequestListComponent;
  let fixture: ComponentFixture<ItemRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
