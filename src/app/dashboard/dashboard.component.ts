import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'gotbot-chef-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styles: ''
})
export class DashboardComponent {

}
