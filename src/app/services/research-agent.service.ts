import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface ResearchRequest {
  query: string;
}

interface ResearchResponse {
  final_summary: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
}

interface HistoryItem {
  query: string;
  final_summary: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
  created_at: string;
}

interface HistoryResponse {
  items: HistoryItem[];
}

export type { HistoryItem, HistoryResponse };

@Injectable({
  providedIn: 'root'
})
export class ResearchAgentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  runResearch(query: string): Observable<ResearchResponse> {
    const request: ResearchRequest = { query };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ResearchResponse>(
      `${this.apiUrl}/agents/research`,
      request,
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getHistory(): Observable<HistoryResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<HistoryResponse>(
      `${this.apiUrl}/agents/research/history`,
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your query.';
          break;
        case 401:
          errorMessage = 'Unauthorized access.';
          break;
        case 403:
          errorMessage = 'Access forbidden.';
          break;
        case 404:
          errorMessage = 'Service not found.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}