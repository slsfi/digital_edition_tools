import { NgModule, InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  production: boolean;
  version: string;
  image_logo: string;
}

export const APP_DI_CONFIG: AppConfig = {
  production: environment.production,
  version: environment.version,
  image_logo: "logo.png"
};

@NgModule({
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})
export class AppConfigModule { }