import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';

import { App } from './app';
import { WebsiteDataService } from './services/website-data.service';

describe('App', () => {
  let mockWebsiteDataService: jasmine.SpyObj<WebsiteDataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WebsiteDataService', ['getWebsiteData']);

    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: WebsiteDataService, useValue: spy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    mockWebsiteDataService = TestBed.inject(WebsiteDataService) as jasmine.SpyObj<WebsiteDataService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const mockData = {
      site: { title: 'AI Agents Hub', description: 'Test description' },
      images: {
        architecture_diagram: '/test.gif',
        logo_light: '/test-light.png',
        logo_dark: '/test-dark.png'
      },
      hero: {
        title: 'Test Hero',
        subtitle: 'Test Subtitle',
        cta_text: 'Test CTA',
        scroll_text: 'Test Scroll'
      },
      navigation: { home: 'Home', agents: 'Agents', about: 'About' },
      sections: {
        architecture: {
          title: 'Test Architecture',
          subtitle: 'Test Subtitle',
          description: 'Test Description',
          preview_image: '/test.gif'
        },
        how_it_works: {
          title: 'Test How It Works',
          description: 'Test Description',
          steps: []
        },
        cost: {
          title: 'Test Cost',
          description: 'Test Description',
          details: [],
          note: 'Test Note'
        }
      },
      agents: [],
      footer: {
        copyright: 'Test Copyright',
        links: []
      }
    };

    mockWebsiteDataService.getWebsiteData.and.returnValue(of(mockData));

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('AI Agents Hub');
  });
});
