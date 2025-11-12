import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class App {
  // user inputs
  password: string = '';
  userName: string = '';
  userEmail: string = '';

  // generator options
  includeUpper: boolean = true;
  includeLower: boolean = true;
  includeNumbers: boolean = true;
  includeSymbols: boolean = true;
  length: number = 14;

  // ui state
  showPassword: boolean = false;
  strengthMessage: string = '';
  strengthColor: string = '#9e9e9e';
  suggestedPassword: string = '';
  copyStatus: string = ''; // temporary feedback

  checkStrength() {
    const pwd = this.password || '';
    let score = 0;

    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++; // extra point for long pass
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    // choose message and color based on score (0-5)
    if (pwd.length === 0) {
      this.strengthMessage = '';
      this.strengthColor = '#9e9e9e';
      return;
    }

    if (score <= 2) {
      this.strengthMessage = 'Weak';
      this.strengthColor = '#e53935'; // red
    } else if (score === 3) {
      this.strengthMessage = 'Moderate';
      this.strengthColor = '#fb8c00'; // orange
    } else if (score === 4) {
      this.strengthMessage = 'Strong';
      this.strengthColor = '#00695c'; // teal
    } else {
      this.strengthMessage = 'Very Strong';
      this.strengthColor = '#6a1b9a'; // purple
    }
  }

  generateSuggestion() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}<>?';

    let pool = '';
    if (this.includeUpper) pool += upper;
    if (this.includeLower) pool += lower;
    if (this.includeNumbers) pool += numbers;
    if (this.includeSymbols) pool += symbols;

    // fallback to sensible default
    if (!pool) pool = upper + lower + numbers;

    // enforce sensible bounds
    const desiredLength = Math.max(6, Math.min(64, Math.round(this.length)));

    // build base suggestion
    let suggestion = '';
    for (let i = 0; i < desiredLength; i++) {
      suggestion += pool.charAt(Math.floor(Math.random() * pool.length));
    }

    // try to incorporate small memorable bits from user info (non-identifying, short)
    const picks: string[] = [];
    const name = (this.userName || '').trim();
    if (name) {
      // use initials (max 2 chars)
      const initials = name
        .split(/\s+/)
        .map((p) => p.charAt(0))
        .join('')
        .slice(0, 2);
      if (initials) picks.push(initials.toUpperCase());
    }

    const email = (this.userEmail || '').trim();
    if (email && email.includes('@')) {
      const local = email.split('@')[0];
      if (local) picks.push(local.charAt(0).toUpperCase());
    }

    // insert picks at random positions
    picks.forEach((pk) => {
      const pos = Math.floor(Math.random() * (suggestion.length + 1));
      suggestion = suggestion.slice(0, pos) + pk + suggestion.slice(pos);
    });

    // if length grew beyond desiredLength, trim from both ends (center-preserve)
    if (suggestion.length > desiredLength) {
      const start = Math.floor((suggestion.length - desiredLength) / 2);
      suggestion = suggestion.slice(start, start + desiredLength);
    }

    this.suggestedPassword = suggestion;
    this.copyStatus = '';
  }

  async copySuggestion() {
    if (!this.suggestedPassword) return;
    try {
      await navigator.clipboard.writeText(this.suggestedPassword);
      this.copyStatus = 'Copied!';
    } catch (err) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = this.suggestedPassword;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        this.copyStatus = 'Copied!';
      } catch {
        this.copyStatus = 'Copy failed — please copy manually';
      } finally {
        document.body.removeChild(ta);
      }
    }

    // clear status after 2 seconds
    setTimeout(() => (this.copyStatus = ''), 2000);
  }

  useSuggestion() {
    if (!this.suggestedPassword) return;
    this.password = this.suggestedPassword;
    this.checkStrength();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  get passwordPlaceholder(): string {
    if (this.suggestedPassword) {
      // show a short hint, don't reveal the entire suggestion in placeholder if it's long
      const hint = this.suggestedPassword.length > 24 ? this.suggestedPassword.slice(0, 20) + '...' : this.suggestedPassword;
      return `Suggested → ${hint} (click Use or Copy)`;
    }
    if (this.userName || this.userEmail) {
      return 'Type a password or generate a personalized suggestion';
    }
    return 'Enter your password';
  }
}