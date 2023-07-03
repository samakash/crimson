import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MeditationService } from '../service/meditation.service';

import { MeditationComponent } from './meditation.component';

describe('Meditation Management Component', () => {
  let comp: MeditationComponent;
  let fixture: ComponentFixture<MeditationComponent>;
  let service: MeditationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'meditation', component: MeditationComponent }]), HttpClientTestingModule],
      declarations: [MeditationComponent],
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
      .overrideTemplate(MeditationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MeditationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MeditationService);

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
    expect(comp.meditations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to meditationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMeditationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMeditationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
