import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MoodFormService } from './mood-form.service';
import { MoodService } from '../service/mood.service';
import { IMood } from '../mood.model';

import { MoodUpdateComponent } from './mood-update.component';

describe('Mood Management Update Component', () => {
  let comp: MoodUpdateComponent;
  let fixture: ComponentFixture<MoodUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let moodFormService: MoodFormService;
  let moodService: MoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MoodUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MoodUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MoodUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    moodFormService = TestBed.inject(MoodFormService);
    moodService = TestBed.inject(MoodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mood: IMood = { id: 456 };

      activatedRoute.data = of({ mood });
      comp.ngOnInit();

      expect(comp.mood).toEqual(mood);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMood>>();
      const mood = { id: 123 };
      jest.spyOn(moodFormService, 'getMood').mockReturnValue(mood);
      jest.spyOn(moodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mood });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mood }));
      saveSubject.complete();

      // THEN
      expect(moodFormService.getMood).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(moodService.update).toHaveBeenCalledWith(expect.objectContaining(mood));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMood>>();
      const mood = { id: 123 };
      jest.spyOn(moodFormService, 'getMood').mockReturnValue({ id: null });
      jest.spyOn(moodService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mood: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mood }));
      saveSubject.complete();

      // THEN
      expect(moodFormService.getMood).toHaveBeenCalled();
      expect(moodService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMood>>();
      const mood = { id: 123 };
      jest.spyOn(moodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mood });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(moodService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
