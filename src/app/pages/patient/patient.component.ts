import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { DoctorService } from '../../services/doctor.service';
import { DoctorResourceDto } from '../../model/doctor/doctor-resource.dto';
import { ErrorModelDto } from '../../utils/models/error-model.dto';
import { ClinicService } from '../../services/clinic.service';
import { ComboModelDto } from '../../utils/models/combo-model.dto';
import { Subscription } from 'rxjs';
import { ListPatientComponent } from './list-patient/list-patient.component';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [AddPatientComponent, ListPatientComponent],
  templateUrl: './patient.component.html',
})
export class PatientComponent {}
