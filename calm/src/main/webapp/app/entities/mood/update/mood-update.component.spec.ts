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
import { IMeditation } from 'app/entities/meditation/meditation.model';
import { MeditationService } from 'app/entities/meditation/service/meditation.service';

import { MoodUpdateComponent } from './mood-update.component';

describe('Mood Management Update Component', () => {
  let comp: MoodUpdateComponent;
  let fixture: ComponentFixture<MoodUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let moodFormService: MoodFormService;
  let moodService: MoodService;
  let meditationService: MeditationService;

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
    meditationService = TestBed.inject(MeditationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Meditation query and add missing value', () => {
      const mood: IMood = { id: 456 };
      const meditation: IMeditation = { id: 68925 };
      mood.meditation = meditation;

      const meditationCollection: IMeditation[] = [{ id: 61290 }];
      jest.spyOn(meditationService, 'query').mockReturnValue(of(new HttpResponse({ body: meditationCollection })));
      const additionalMeditations = [meditation];
      const expectedCollection: IMeditation[] = [...additionalMeditations, ...meditationCollection];
      jest.spyOn(meditationService, 'addMeditationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mood });
      comp.ngOnInit();

      expect(meditationService.query).toHaveBeenCalled();
      expect(meditationService.addMeditationToCollectionIfMissing).toHaveBeenCalledWith(
        meditationCollection,
        ...additionalMeditations.map(expect.objectContaining)
      );
      expect(comp.meditationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mood: IMood = { id: 456 };
      const meditation: IMeditation = { id: 76125 };
      mood.meditation = meditation;

      activatedRoute.data = of({ mood });
      comp.ngOnInit();

      expect(comp.meditationsSharedCollection).toContain(meditation);
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

  describe('Compare relationships', () => {
    describe('compareMeditation', () => {
      it('Should forward to meditationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(meditationService, 'compareMeditation');
        comp.compareMeditation(entity, entity2);
        expect(meditationService.compareMeditation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
