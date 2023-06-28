import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MeditationSessionFormService } from './meditation-session-form.service';
import { MeditationSessionService } from '../service/meditation-session.service';
import { IMeditationSession } from '../meditation-session.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IMeditation } from 'app/entities/meditation/meditation.model';
import { MeditationService } from 'app/entities/meditation/service/meditation.service';

import { MeditationSessionUpdateComponent } from './meditation-session-update.component';

describe('MeditationSession Management Update Component', () => {
  let comp: MeditationSessionUpdateComponent;
  let fixture: ComponentFixture<MeditationSessionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let meditationSessionFormService: MeditationSessionFormService;
  let meditationSessionService: MeditationSessionService;
  let userService: UserService;
  let meditationService: MeditationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MeditationSessionUpdateComponent],
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
      .overrideTemplate(MeditationSessionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MeditationSessionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    meditationSessionFormService = TestBed.inject(MeditationSessionFormService);
    meditationSessionService = TestBed.inject(MeditationSessionService);
    userService = TestBed.inject(UserService);
    meditationService = TestBed.inject(MeditationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const meditationSession: IMeditationSession = { id: 456 };
      const user: IUser = { id: 81230 };
      meditationSession.user = user;

      const userCollection: IUser[] = [{ id: 6585 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ meditationSession });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Meditation query and add missing value', () => {
      const meditationSession: IMeditationSession = { id: 456 };
      const meditation: IMeditation = { id: 45783 };
      meditationSession.meditation = meditation;

      const meditationCollection: IMeditation[] = [{ id: 77384 }];
      jest.spyOn(meditationService, 'query').mockReturnValue(of(new HttpResponse({ body: meditationCollection })));
      const additionalMeditations = [meditation];
      const expectedCollection: IMeditation[] = [...additionalMeditations, ...meditationCollection];
      jest.spyOn(meditationService, 'addMeditationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ meditationSession });
      comp.ngOnInit();

      expect(meditationService.query).toHaveBeenCalled();
      expect(meditationService.addMeditationToCollectionIfMissing).toHaveBeenCalledWith(
        meditationCollection,
        ...additionalMeditations.map(expect.objectContaining)
      );
      expect(comp.meditationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const meditationSession: IMeditationSession = { id: 456 };
      const user: IUser = { id: 17805 };
      meditationSession.user = user;
      const meditation: IMeditation = { id: 62311 };
      meditationSession.meditation = meditation;

      activatedRoute.data = of({ meditationSession });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.meditationsSharedCollection).toContain(meditation);
      expect(comp.meditationSession).toEqual(meditationSession);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMeditationSession>>();
      const meditationSession = { id: 123 };
      jest.spyOn(meditationSessionFormService, 'getMeditationSession').mockReturnValue(meditationSession);
      jest.spyOn(meditationSessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ meditationSession });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: meditationSession }));
      saveSubject.complete();

      // THEN
      expect(meditationSessionFormService.getMeditationSession).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(meditationSessionService.update).toHaveBeenCalledWith(expect.objectContaining(meditationSession));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMeditationSession>>();
      const meditationSession = { id: 123 };
      jest.spyOn(meditationSessionFormService, 'getMeditationSession').mockReturnValue({ id: null });
      jest.spyOn(meditationSessionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ meditationSession: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: meditationSession }));
      saveSubject.complete();

      // THEN
      expect(meditationSessionFormService.getMeditationSession).toHaveBeenCalled();
      expect(meditationSessionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMeditationSession>>();
      const meditationSession = { id: 123 };
      jest.spyOn(meditationSessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ meditationSession });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(meditationSessionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
