import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { DoctorService } from './doctor.service';
import { DoctorResourceDto } from '../model/doctor/doctor-resource.dto';
import { DoctorCreateResourceDto } from '../model/doctor/doctor-create-resource.dto';
import { DoctorUpdateResourceDto } from '../model/doctor/doctor-update-resource.dto';

describe('DoctorService', () => {
  let service: DoctorService;
  let httpMock: HttpTestingController;
  const host = environment.hostRmFarma;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DoctorService],
    });
    service = TestBed.inject(DoctorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('findAllDoctors issues a GET to host/doctor and emits the array', (done) => {
    const doctors: DoctorResourceDto[] = [
      {
        id: 'd-1',
        rut: '11.111.111-1',
        name: 'Dr. Pérez',
        code: 42,
        enabled: true,
      },
    ];
    service.findAllDoctors().subscribe((resp) => {
      expect(resp).toEqual(doctors);
      done();
    });
    const req = httpMock.expectOne(`${host}/doctor`);
    expect(req.request.method).toBe('GET');
    req.flush(doctors);
  });

  it('findAllDoctors emits an empty array when the backend returns []', (done) => {
    service.findAllDoctors().subscribe((resp) => {
      expect(resp).toEqual([]);
      done();
    });
    const req = httpMock.expectOne(`${host}/doctor`);
    req.flush([]);
  });

  it('findDoctorByRut issues a GET to host/doctor/find-by-rut/:rut', (done) => {
    const doctor: DoctorResourceDto = {
      id: 'd-1',
      rut: '11.111.111-1',
      name: 'Dr. Pérez',
      code: 42,
      enabled: true,
    };
    service.findDoctorByRut('11.111.111-1').subscribe((resp) => {
      expect(resp).toEqual(doctor);
      done();
    });
    const req = httpMock.expectOne(`${host}/doctor/find-by-rut/11.111.111-1`);
    expect(req.request.method).toBe('GET');
    req.flush(doctor);
  });

  it('createDoctor issues a POST to host/doctor with the dto as body', (done) => {
    const dto: DoctorCreateResourceDto = {
      rut: '11.111.111-1',
      name: 'Dr. Pérez',
      code: 42,
    };
    const responseBody: DoctorResourceDto = {
      id: 'd-7',
      rut: '11.111.111-1',
      name: 'Dr. Pérez',
      code: 42,
      enabled: true,
    };
    service.createDoctor(dto).subscribe((resp) => {
      expect(resp).toEqual(responseBody);
      done();
    });
    const req = httpMock.expectOne(`${host}/doctor`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      rut: '11.111.111-1',
      name: 'Dr. Pérez',
      code: 42,
    });
    req.flush(responseBody);
  });

  it('updateDoctor issues a PUT to host/doctor/:id with the update dto as body', (done) => {
    const dto: DoctorUpdateResourceDto = {
      rut: '22.222.222-2',
      name: 'Dr. Pérez',
    };
    const responseBody: DoctorResourceDto = {
      id: 'd-1',
      rut: '22.222.222-2',
      name: 'Dr. Pérez',
      code: 42,
      enabled: true,
    };
    service.updateDoctor('d-1', dto).subscribe((resp) => {
      expect(resp).toEqual(responseBody);
      done();
    });
    const req = httpMock.expectOne(`${host}/doctor/d-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      rut: '22.222.222-2',
      name: 'Dr. Pérez',
    });
    // Locked contract: update payload MUST NOT carry code.
    expect(
      (req.request.body as Record<string, unknown>)['code'],
    ).toBeUndefined();
    req.flush(responseBody);
  });

  it('deleteDoctor issues a DELETE to host/doctor/:id and completes', (done) => {
    service.deleteDoctor('d-1').subscribe({
      next: (resp: void | DoctorResourceDto) => {
        // Empty body resolves to null/undefined.
        expect(resp == null).toBe(true);
      },
      complete: () => done(),
    });
    const req = httpMock.expectOne(`${host}/doctor/d-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deleteDoctor propagates HTTP errors to the observable', (done) => {
    service.deleteDoctor('d-1').subscribe({
      next: () => {
        fail('expected the observable to error');
      },
      error: (err: { status: number }) => {
        expect(err.status).toBe(500);
        done();
      },
    });
    const req = httpMock.expectOne(`${host}/doctor/d-1`);
    req.flush('boom', { status: 500, statusText: 'Server Error' });
  });
});
