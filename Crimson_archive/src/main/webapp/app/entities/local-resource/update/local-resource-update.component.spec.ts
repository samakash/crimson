import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LocalResourceFormService } from './local-resource-form.service';
import { LocalResourceService } from '../service/local-resource.service';
import { ILocalResource } from '../local-resource.model';

import { LocalResourceUpdateComponent } from './local-resource-update.component';

describe('LocalResource Management Update Component', () => {
  let comp: LocalResourceUpdateComponent;
  let fixture: ComponentFixture<LocalResourceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let localResourceFormService: LocalResourceFormService;
  let localResourceService: LocalResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LocalResourceUpdateComponent],
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
      .overrideTemplate(LocalResourceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LocalResourceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    localResourceFormService = TestBed.inject(LocalResourceFormService);
    localResourceService = TestBed.inject(LocalResourceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const localResource: ILocalResource = { id: 456 };

      activatedRoute.data = of({ localResource });
      comp.ngOnInit();

      expect(comp.localResource).toEqual(localResource);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocalResource>>();
      const localResource = { id: 123 };
      jest.spyOn(localResourceFormService, 'getLocalResource').mockReturnValue(localResource);
      jest.spyOn(localResourceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ localResource });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: localResource }));
      saveSubject.complete();

      // THEN
      expect(localResourceFormService.getLocalResource).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(localResourceService.update).toHaveBeenCalledWith(expect.objectContaining(localResource));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocalResource>>();
      const localResource = { id: 123 };
      jest.spyOn(localResourceFormService, 'getLocalResource').mockReturnValue({ id: null });
      jest.spyOn(localResourceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ localResource: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: localResource }));
      saveSubject.complete();

      // THEN
      expect(localResourceFormService.getLocalResource).toHaveBeenCalled();
      expect(localResourceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILocalResource>>();
      const localResource = { id: 123 };
      jest.spyOn(localResourceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ localResource });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(localResourceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
