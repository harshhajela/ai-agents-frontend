import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WebsiteDataService, WebsiteData } from '../../services/website-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  websiteData = signal<WebsiteData | null>(null);

  constructor(
    private router: Router,
    private websiteDataService: WebsiteDataService
  ) {}

  ngOnInit() {
    this.websiteDataService.getWebsiteData().subscribe({
      next: (data) => {
        this.websiteData.set(data);
      },
      error: (error) => {
        console.error('Error loading website data:', error);
      }
    });
  }

  navigateToAgent(agentId: string) {
    this.router.navigate(['/agents', agentId]);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}