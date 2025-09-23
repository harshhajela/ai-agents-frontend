import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientModule } from '@angular/common/http';
import { ResearchAgentService, type HistoryItem } from '../../services/research-agent.service';
import { WebsiteDataService, WebsiteData } from '../../services/website-data.service';
import { ToastService } from '../../services/toast.service';
import { HistoryModalComponent } from '../history-modal/history-modal.component';
import { ProcessAnimationComponent } from '../process-animation/process-animation.component';

interface ResearchResult {
  final_summary: string;
  sources: {
    title: string;
    url: string;
  }[];
}

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule, HttpClientModule, HistoryModalComponent, ProcessAnimationComponent],
  templateUrl: './agent-detail.component.html',
  styleUrl: './agent-detail.component.scss'
})
export class AgentDetailComponent implements OnInit {
  agentId = signal<string>('');
  websiteData = signal<WebsiteData | null>(null);
  agentInfo = signal<any>(null);
  query = signal<string>('');
  submittedQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  showAnimation = signal<boolean>(false);
  result = signal<ResearchResult | null>(null);
  error = signal<string>('');

  // History functionality
  history = signal<HistoryItem[]>([]);
  isLoadingHistory = signal<boolean>(false);
  historyError = signal<string>('');
  selectedHistoryItem = signal<HistoryItem | null>(null);
  isModalVisible = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private researchService: ResearchAgentService,
    private websiteDataService: WebsiteDataService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.websiteDataService.getWebsiteData().subscribe({
      next: (data) => {
        this.websiteData.set(data);
        this.route.params.subscribe(params => {
          this.agentId.set(params['id']);
          const agent = data.agents.find(a => a.id === params['id']);
          this.agentInfo.set(agent || null);

          // Load history when agent is set
          if (agent) {
            this.loadHistory();
          }
        });
      },
      error: (error) => {
        console.error('Error loading website data:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  async submitQuery() {
    if (!this.query().trim()) return;

    this.isLoading.set(true);
    this.showAnimation.set(true);
    this.error.set('');
    this.result.set(null);

    const submittedQuery = this.query(); // Store the query before clearing
    this.submittedQuery.set(submittedQuery); // Store the submitted query for display

    try {
      const response = await this.researchService.runResearch(submittedQuery).toPromise();
      if (response) {
        // Simulate the process animation duration
        setTimeout(() => {
          this.result.set(response);
          this.query.set(''); // Clear the input after successful submission
          this.showAnimation.set(false);
          // Refresh history after successful query
          this.loadHistory();
          // Scroll to results section
          this.scrollToSection('results-section');
        }, 7500); // Total animation duration
      }
    } catch (err: any) {
      // Show error toast instead of displaying error in UI
      const errorMessage = err.message || 'An error occurred while processing your request';
      this.toastService.showError(errorMessage);
      this.showAnimation.set(false);
    } finally {
      this.isLoading.set(false);
    }
  }

  loadHistory() {
    this.isLoadingHistory.set(true);
    this.historyError.set('');

    this.researchService.getHistory().subscribe({
      next: (response) => {
        // Sort by created_at in descending order (latest first)
        const sortedHistory = response.items.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        this.history.set(sortedHistory);
        this.isLoadingHistory.set(false);
      },
      error: (error) => {
        console.error('Error loading history:', error);
        this.historyError.set('Failed to load history');
        this.toastService.showError('Failed to load query history');
        this.isLoadingHistory.set(false);
      }
    });
  }

  openHistoryModal(historyItem: HistoryItem) {
    this.selectedHistoryItem.set(historyItem);
    this.isModalVisible.set(true);
  }

  closeHistoryModal() {
    this.isModalVisible.set(false);
    this.selectedHistoryItem.set(null);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  truncateQuery(query: string, maxLength = 80): string {
    if (query.length <= maxLength) return query;
    return query.substring(0, maxLength) + '...';
  }

  getUniqueTopics(): number {
    const topics = new Set(this.history().map(item =>
      item.query.toLowerCase().split(' ').slice(0, 3).join(' ')
    ));
    return topics.size;
  }

  getAverageResponseTime(): string {
    // Simulated response time calculation
    // In a real implementation, this would use actual timing data
    if (this.history().length === 0) return '0';

    const avgTime = 2.5 + (Math.random() * 2); // Simulate 2.5-4.5 seconds
    return avgTime.toFixed(1);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}