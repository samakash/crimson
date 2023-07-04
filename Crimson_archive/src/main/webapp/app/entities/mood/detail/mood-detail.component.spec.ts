import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MoodDetailComponent } from './mood-detail.component';

describe('Mood Management Detail Component', () => {
  let comp: MoodDetailComponent;
  let fixture: ComponentFixture<MoodDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoodDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mood: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MoodDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MoodDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mood on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mood).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
