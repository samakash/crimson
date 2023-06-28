import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LocalResourceService } from '../service/local-resource.service';

import { LocalResourceComponent } from './local-resource.component';

describe('LocalResource Management Component', () => {
  let comp: LocalResourceComponent;
  let fixture: ComponentFixture<LocalResourceComponent>;
  let service: LocalResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'local-resource', component: LocalResourceComponent }]), HttpClientTestingModule],
      declarations: [LocalResourceComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LocalResourceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LocalResourceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LocalResourceService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.localResources?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to localResourceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLocalResourceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLocalResourceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
