import { AuthModule } from "./auth.module";
import { RoutesModule } from "./routes.module";

import { LoginComponent } from "./components/login.component";
import { LogoutComponent } from "./components/logout.component";

import { AuthService } from "./services/auth.service";

import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/not-auth.guard";
import { LecturerGuard } from "./guards/lecturer.guard";
import { EditorGuard } from "./guards/editor.guard";
import { AdminGuard } from "./guards/admin.guard";
import { StartPageGuard } from "./guards/start-page.guard";

export {
	AuthModule,
	RoutesModule,

	LoginComponent,
	LogoutComponent,

	AuthService,

	AuthGuard,
	NotAuthGuard,
	LecturerGuard,
	EditorGuard,
	AdminGuard,
	StartPageGuard
}
