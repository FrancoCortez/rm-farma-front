import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-list-patient',
  standalone: true,
  imports: [TableModule],
  templateUrl: './list-patient.component.html',
})
export class ListPatientComponent {}
