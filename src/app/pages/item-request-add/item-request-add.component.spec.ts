import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRequestAddComponent } from './item-request-add.component';

describe('ItemRequestAddComponent', () => {
  let component: ItemRequestAddComponent;
  let fixture: ComponentFixture<ItemRequestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemRequestAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
