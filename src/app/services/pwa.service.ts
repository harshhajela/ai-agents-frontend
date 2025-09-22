import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any = null;
  canInstall = signal<boolean>(false);
  isStandalone = signal<boolean>(false);

  constructor() {
    this.checkStandaloneMode();
    this.setupInstallPrompt();
  }

  private checkStandaloneMode() {
    // Check if app is running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    this.isStandalone.set(isStandalone);
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      this.deferredPrompt = e;
      // Show install button
      this.canInstall.set(true);
    });

    window.addEventListener('appinstalled', () => {
      // Hide install button after successful installation
      this.canInstall.set(false);
      this.deferredPrompt = null;
    });
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      // Show the install prompt
      this.deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        this.canInstall.set(false);
        this.deferredPrompt = null;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  }

  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  }

  shouldShowIOSInstallPrompt(): boolean {
    return this.isIOS() && !this.isStandalone() && !this.hasPromptBeenShown();
  }

  shouldShowAndroidInstallPrompt(): boolean {
    return this.isAndroid() && this.canInstall() && !this.hasPromptBeenShown();
  }

  private hasPromptBeenShown(): boolean {
    return localStorage.getItem('pwa-install-prompt-shown') === 'true';
  }

  markPromptAsShown() {
    localStorage.setItem('pwa-install-prompt-shown', 'true');
  }

  dismissPrompt() {
    this.markPromptAsShown();
  }
}