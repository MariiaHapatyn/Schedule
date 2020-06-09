import "rxjs/add/observable/forkJoin"
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/first";
import "rxjs/add/operator/map";
import "rxjs/add/operator/publish";
import "rxjs/add/operator/switchMap";

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { environment } from "./environments/environment";

import { AppModule } from "./app/app.module";

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
