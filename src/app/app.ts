import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WebsiteDataService, WebsiteData } from './services/website-data.service';
import { InstallPromptComponent } from './components/install-prompt/install-prompt.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { PwaService } from './services/pwa.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HttpClientModule, InstallPromptComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  mobileMenuOpen = signal(false);
  isDarkTheme = signal(false);
  websiteData = signal<WebsiteData | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private websiteDataService: WebsiteDataService,
    private pwaService: PwaService
  ) {}

  ngOnInit() {
    // Load website data
    this.websiteDataService.getWebsiteData().subscribe({
      next: (data) => {
        this.websiteData.set(data);
      },
      error: (error) => {
        console.error('Error loading website data:', error);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      // Check for saved theme preference or default to light mode
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      this.isDarkTheme.set(shouldUseDark);
      this.updateTheme();

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.isDarkTheme.set(e.matches);
          this.updateTheme();
        }
      });
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  toggleTheme() {
    this.isDarkTheme.update(value => !value);
    this.updateTheme();

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkTheme() ? 'dark' : 'light');
    }
  }

  private updateTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      if (this.isDarkTheme()) {
        htmlElement.setAttribute('data-theme', 'dark');
      } else {
        htmlElement.removeAttribute('data-theme');
      }
    }
  }
}
