import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WebsiteData {
  site: {
    title: string;
    description: string;
  };
  images: {
    architecture_diagram: string;
    logo_light: string;
    logo_dark: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta_text: string;
    scroll_text: string;
  };
  navigation: {
    home: string;
    agents: string;
    about: string;
  };
  sections: {
    architecture: {
      title: string;
      subtitle: string;
      description: string;
      preview_image: string;
    };
    how_it_works: {
      title: string;
      description: string;
      steps: {
        title: string;
        description: string;
      }[];
    };
    cost: {
      title: string;
      description: string;
      details: {
        item: string;
        price: string;
      }[];
      note: string;
    };
  };
  agents: {
    id: string;
    name: string;
    summary: string;
    description: string;
    architecture: string;
    cost: string;
    techStack: string[];
    features: string[];
    use_cases: string[];
  }[];
  footer: {
    copyright: string;
    links: {
      title: string;
      url: string;
    }[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class WebsiteDataService {
  constructor(private http: HttpClient) {}

  getWebsiteData(): Observable<WebsiteData> {
    return this.http.get<WebsiteData>('/assets/website-data.json');
  }
}