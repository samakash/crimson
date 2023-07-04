import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReferalService } from '../service/referal.service';

import { ReferalComponent } from './referal.component';

describe('Referal Management Component', () => {
  let comp: ReferalComponent;
  let fixture: ComponentFixture<ReferalComponent>;
  let service: ReferalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'referal', component: ReferalComponent }]), HttpClientTestingModule],
      declarations: [ReferalComponent],
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
      .overrideTemplate(ReferalComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReferalComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReferalService);

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
    expect(comp.referals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to referalService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getReferalIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getReferalIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
