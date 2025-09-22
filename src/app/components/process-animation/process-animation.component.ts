import { Component, Input, OnInit, OnDestroy, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProcessStep {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed';
  duration: number;
}

@Component({
  selector: 'app-process-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process-animation.component.html',
  styleUrl: './process-animation.component.scss'
})
export class ProcessAnimationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isVisible = false;

  currentStep = signal(0);
  isComplete = signal(false);

  private animationInterval?: number;

  steps: ProcessStep[] = [
    {
      id: 'langchain',
      name: 'LangChain Orchestrator',
      description: 'Analyzing your query and planning the research strategy',
      icon: '🧠',
      status: 'pending',
      duration: 2000
    },
    {
      id: 'tavily',
      name: 'Tavily Search',
      description: 'Fetching the latest, relevant information from the web',
      icon: '🔍',
      status: 'pending',
      duration: 3000
    },
    {
      id: 'openrouter',
      name: 'OpenRouter LLM',
      description: 'Synthesizing a clean summary with citations in Markdown',
      icon: '✨',
      status: 'pending',
      duration: 2500
    }
  ];

  ngOnInit() {
    if (this.isVisible) {
      this.startAnimation();
    }
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  ngOnChanges() {
    if (this.isVisible && !this.animationInterval) {
      this.startAnimation();
    } else if (!this.isVisible) {
      this.resetAnimation();
    }
  }

  private startAnimation() {
    this.resetAnimation();

    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex < this.steps.length) {
        // Mark current step as active
        this.steps[stepIndex].status = 'active';
        this.currentStep.set(stepIndex);

        setTimeout(() => {
          // Mark current step as completed
          this.steps[stepIndex].status = 'completed';
          stepIndex++;

          if (stepIndex < this.steps.length) {
            runStep();
          } else {
            // All steps completed
            this.isComplete.set(true);
          }
        }, this.steps[stepIndex].duration);
      }
    };

    runStep();
  }

  private resetAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    this.currentStep.set(0);
    this.isComplete.set(false);

    this.steps.forEach(step => {
      step.status = 'pending';
    });
  }

  getStepClass(step: ProcessStep): string {
    return `step-${step.status}`;
  }
}