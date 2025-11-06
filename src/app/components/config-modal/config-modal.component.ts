import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ModelConfig {
  model_name?: 'llama' | 'deepseek' | 'google' | 'grok';
  temperature?: number;
}

interface ModelInfo {
  id: 'llama' | 'deepseek' | 'google' | 'grok';
  name: string;
  description: string;
  power: string;
  pricing: '$' | '$$' | '$$$';
  available: boolean;
}

@Component({
  selector: 'app-config-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-modal.component.html',
  styleUrl: './config-modal.component.scss'
})
export class ConfigModalComponent {
  @Input() isVisible = false;
  @Input() currentConfig: ModelConfig = {};
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ModelConfig>();

  selectedModel = signal<'llama' | 'deepseek' | 'google' | 'grok' | undefined>(undefined);
  temperature = signal<number | undefined>(undefined);

  models: ModelInfo[] = [
    {
      id: 'grok',
      name: 'Grok 4 Fast',
      description: 'xAI\'s rapid response model with wit and accuracy',
      power: 'Fast inference for real-time queries',
      pricing: '$',
      available: true
    },
    {
      id: 'llama',
      name: 'Llama 3.1 8B',
      description: 'Meta\'s fast and efficient open-source model',
      power: 'Great for everyday research tasks',
      pricing: '$',
      available: false
    },
    {
      id: 'deepseek',
      name: 'DeepSeek Chat',
      description: 'Advanced reasoning and deep analysis capabilities',
      power: 'Excellent for complex research',
      pricing: '$',
      available: false
    },
    {
      id: 'google',
      name: 'Gemma 2 9B',
      description: 'Google\'s lightweight and efficient AI model',
      power: 'Balanced performance for diverse tasks',
      pricing: '$',
      available: false
    },
    {
      id: 'openai' as any,
      name: 'GPT-4 Turbo',
      description: 'OpenAI\'s most capable and efficient model',
      power: 'Exceptional reasoning and creativity',
      pricing: '$$$',
      available: false
    },
    {
      id: 'anthropic' as any,
      name: 'Claude 3.5 Sonnet',
      description: 'Anthropic\'s flagship model with superior intelligence',
      power: 'Best-in-class for complex analysis',
      pricing: '$$$',
      available: false
    },
    {
      id: 'mistral' as any,
      name: 'Mistral Large',
      description: 'High-performance European AI model',
      power: 'Excellent multilingual capabilities',
      pricing: '$$',
      available: false
    }
  ];

  ngOnInit() {
    this.selectedModel.set(this.currentConfig.model_name);
    this.temperature.set(this.currentConfig.temperature);
  }

  ngOnChanges() {
    this.selectedModel.set(this.currentConfig.model_name);
    this.temperature.set(this.currentConfig.temperature);
  }

  selectModel(modelId: 'llama' | 'deepseek' | 'google' | 'grok') {
    const model = this.models.find(m => m.id === modelId);
    if (model?.available) {
      this.selectedModel.set(modelId);
    }
  }

  onTemperatureChange(event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.temperature.set(value);
  }

  getTemperatureLabel(): string {
    const temp = this.temperature();
    if (temp === undefined || temp === null) return 'Default';
    if (temp === 0) return 'Precise';
    if (temp <= 0.5) return 'Focused';
    if (temp <= 1.0) return 'Balanced';
    if (temp <= 1.5) return 'Creative';
    return 'Experimental';
  }

  getPricingColor(pricing: string): string {
    switch (pricing) {
      case '$': return '#10b981';
      case '$$': return '#f59e0b';
      case '$$$': return '#ef4444';
      default: return '#6b7280';
    }
  }

  closeModal() {
    this.close.emit();
  }

  saveConfig() {
    const config: ModelConfig = {
      model_name: this.selectedModel(),
      temperature: this.temperature()
    };
    this.save.emit(config);
    this.close.emit();
  }

  resetToDefaults() {
    this.selectedModel.set(undefined);
    this.temperature.set(undefined);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
