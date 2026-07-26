import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalsDataAccess } from './animals-data-access';

describe('AnimalsDataAccess', () => {
  let component: AnimalsDataAccess;
  let fixture: ComponentFixture<AnimalsDataAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalsDataAccess],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalsDataAccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
