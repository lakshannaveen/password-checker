import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app.component';

bootstrapApplication(App, {
  providers: [provideRouter([])],
}).catch((err) => console.error(err));