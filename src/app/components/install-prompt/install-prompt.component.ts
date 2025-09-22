import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showPrompt()) {
      <div class="install-banner" [class.ios]="pwaService.isIOS()">
        <div class="banner-content">
          <div class="banner-icon">
            📱
          </div>
          <div class="banner-text">
            <h3>Install AI Agents Hub</h3>
            <p>{{ getInstallMessage() }}</p>
          </div>
          <div class="banner-actions">
            @if (!pwaService.isIOS()) {
              <button class="install-btn" (click)="installApp()">
                Install
              </button>
            }
            <button class="dismiss-btn" (click)="dismiss()">
              ✕
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .install-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-mid));
      color: white;
      padding: 1rem;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      animation: slideUp 0.3s ease-out;

      &.ios {
        bottom: env(safe-area-inset-bottom, 0);
        padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0));
      }
    }

    .banner-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .banner-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .banner-text {
      flex: 1;
      min-width: 0;

      h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.9;
        line-height: 1.3;
      }
    }

    .banner-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .install-btn {
      background: var(--accent-gold);
      color: var(--primary-gradient-start);
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;

      &:hover {
        background: var(--accent-gold-light);
        transform: translateY(-1px);
      }
    }

    .dismiss-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .install-banner {
        padding: 0.75rem;
      }

      .banner-content {
        gap: 0.75rem;
      }

      .banner-text {
        h3 {
          font-size: 1rem;
        }

        p {
          font-size: 0.85rem;
        }
      }

      .install-btn {
        padding: 0.6rem 1.2rem;
        font-size: 0.85rem;
      }
    }
  `]
})
export class InstallPromptComponent implements OnInit {
  showPrompt = signal<boolean>(false);

  constructor(public pwaService: PwaService) {}

  ngOnInit() {
    // Show prompt after a short delay to avoid being too intrusive
    setTimeout(() => {
      if (this.pwaService.shouldShowIOSInstallPrompt() || this.pwaService.shouldShowAndroidInstallPrompt()) {
        this.showPrompt.set(true);
      }
    }, 3000);
  }

  getInstallMessage(): string {
    if (this.pwaService.isIOS()) {
      return 'Tap the Share button and select "Add to Home Screen" to install this app.';
    }
    return 'Get quick access and better performance by installing this app on your device.';
  }

  async installApp() {
    if (!this.pwaService.isIOS()) {
      const installed = await this.pwaService.promptInstall();
      if (installed) {
        this.showPrompt.set(false);
      }
    }
  }

  dismiss() {
    this.pwaService.dismissPrompt();
    this.showPrompt.set(false);
  }
}