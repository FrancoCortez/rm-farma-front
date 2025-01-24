import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './patient.component.html',
})
export class PatientComponent {}
