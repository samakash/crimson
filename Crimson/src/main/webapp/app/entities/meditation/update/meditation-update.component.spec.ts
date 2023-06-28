import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MeditationFormService } from './meditation-form.service';
import { MeditationService } from '../service/meditation.service';
import { IMeditation } from '../meditation.model';
import { IMood } from 'app/entities/mood/mood.model';
import { MoodService } from 'app/entities/mood/service/mood.service';

import { MeditationUpdateComponent } from './meditation-update.component';

describe('Meditation Management Update Component', () => {
  let comp: MeditationUpdateComponent;
  let fixture: ComponentFixture<MeditationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let meditationFormService: MeditationFormService;
  let meditationService: MeditationService;
  let moodService: MoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MeditationUpdateComponent],
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
      .overrideTemplate(MeditationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MeditationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    meditationFormService = TestBed.inject(MeditationFormService);
    meditationService = TestBed.inject(MeditationService);
    moodService = TestBed.inject(MoodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Mood query and add missing value', () => {
      const meditation: IMeditation = { id: 456 };
      const mood: IMood = { id: 61837 };
      meditation.mood = mood;

      const moodCollection: IMood[] = [{ id: 85909 }];
      jest.spyOn(moodService, 'query').mockReturnValue(of(new HttpResponse({ body: moodCollection })));
      const additionalMoods = [mood];
      const expectedCollection: IMood[] = [...additionalMoods, ...moodCollection];
      jest.spyOn(moodService, 'addMoodToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ meditation });
      comp.ngOnInit();

      expect(moodService.query).toHaveBeenCalled();
      expect(moodService.addMoodToCollectionIfMissing).toHaveBeenCalledWith(
        moodCollection,
        ...additionalMoods.map(expect.objectContaining)
      );
      expect(comp.moodsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const meditation: IMeditation = { id: 456 };
      const mood: IMood = { id: 98691 };
      meditation.mood = mood;

      activatedRoute.data = of({ meditation });
      comp.ngOnInit();

      expect(comp.moodsSharedCollection).toContain(mood);
      expect(comp.meditation).toEqual(meditation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMeditation>>();
      const meditation = { id: 123 };
      jest.spyOn(meditationFormService, 'getMeditation').mockReturnValue(meditation);
      jest.spyOn(meditationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ meditation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: meditation }));
      saveSubject.complete();

      // THEN
      expect(meditationFormService.getMeditation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(meditationService.update).toHaveBeenCalledWith(expect.objectContaining(meditation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMeditation>>();
      const meditation = { id: 123 };
      jest.spyOn(meditationFormService, 'getMeditation').mockReturnValue({ id: null });
      jest.spyOn(meditationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ meditation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: meditation }));
      saveSubject.complete();

      // THEN
      expect(meditationFormService.getMeditation).toHaveBeenCalled();
      expect(meditationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMeditation>>();
      const meditation = { id: 123 };
      jest.spyOn(meditationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ meditation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(meditationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMood', () => {
      it('Should forward to moodService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(moodService, 'compareMood');
        comp.compareMood(entity, entity2);
        expect(moodService.compareMood).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
