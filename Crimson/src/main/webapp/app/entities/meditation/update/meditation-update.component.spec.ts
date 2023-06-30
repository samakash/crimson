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

import { MeditationUpdateComponent } from './meditation-update.component';

describe('Meditation Management Update Component', () => {
  let comp: MeditationUpdateComponent;
  let fixture: ComponentFixture<MeditationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let meditationFormService: MeditationFormService;
  let meditationService: MeditationService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const meditation: IMeditation = { id: 456 };

      activatedRoute.data = of({ meditation });
      comp.ngOnInit();

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
});
