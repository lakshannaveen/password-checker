import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  password: string = '';
  strengthMessage: string = '';
  strengthColor: string = '';
  suggestedPassword: string = '';

  checkStrength() {
    const pwd = this.password;
    let strength = 0;

    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    switch (strength) {
      case 0:
      case 1:
        this.strengthMessage = 'Weak Password';
        this.strengthColor = 'red';
        break;
      case 2:
        this.strengthMessage = 'Moderate Password';
        this.strengthColor = 'orange';
        break;
      case 3:
        this.strengthMessage = 'Strong Password';
        this.strengthColor = 'blue';
        break;
      case 4:
        this.strengthMessage = 'Very Strong Password';
        this.strengthColor = 'green';
        break;
    }
  }

  generateSuggestion() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&*';
    let suggestion = '';
    for (let i = 0; i < 12; i++) {
      suggestion += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.suggestedPassword = suggestion;
  }
}
