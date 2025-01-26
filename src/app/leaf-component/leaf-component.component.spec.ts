import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafComponentComponent } from './leaf-component.component';

describe('LeafComponentComponent', () => {
  let component: LeafComponentComponent;
  let fixture: ComponentFixture<LeafComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeafComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeafComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
