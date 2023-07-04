import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReferalFormService } from './referal-form.service';
import { ReferalService } from '../service/referal.service';
import { IReferal } from '../referal.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ReferalUpdateComponent } from './referal-update.component';

describe('Referal Management Update Component', () => {
  let comp: ReferalUpdateComponent;
  let fixture: ComponentFixture<ReferalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let referalFormService: ReferalFormService;
  let referalService: ReferalService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReferalUpdateComponent],
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
      .overrideTemplate(ReferalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReferalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    referalFormService = TestBed.inject(ReferalFormService);
    referalService = TestBed.inject(ReferalService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const referal: IReferal = { id: 456 };
      const user: IUser = { id: 39374 };
      referal.user = user;

      const userCollection: IUser[] = [{ id: 89229 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ referal });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const referal: IReferal = { id: 456 };
      const user: IUser = { id: 15823 };
      referal.user = user;

      activatedRoute.data = of({ referal });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.referal).toEqual(referal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReferal>>();
      const referal = { id: 123 };
      jest.spyOn(referalFormService, 'getReferal').mockReturnValue(referal);
      jest.spyOn(referalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ referal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: referal }));
      saveSubject.complete();

      // THEN
      expect(referalFormService.getReferal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(referalService.update).toHaveBeenCalledWith(expect.objectContaining(referal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReferal>>();
      const referal = { id: 123 };
      jest.spyOn(referalFormService, 'getReferal').mockReturnValue({ id: null });
      jest.spyOn(referalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ referal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: referal }));
      saveSubject.complete();

      // THEN
      expect(referalFormService.getReferal).toHaveBeenCalled();
      expect(referalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReferal>>();
      const referal = { id: 123 };
      jest.spyOn(referalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ referal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(referalService.update).toHaveBeenCalled();
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
  });
});
