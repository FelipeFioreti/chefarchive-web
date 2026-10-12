import {Routes} from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: () =>
            import('./login/login.route').then((m) => m.loginRoute)
    },
    {
        path: 'sign-up',
        loadChildren: () =>
            import('./sign-up/sign-up.route').then((m) => m.signUpRoute)
    },
    {
        path: 'forgot-password',
        loadChildren: () =>
            import('./forgot-password/forgot-password.route').then((m) => m.forgotPasswordRoute)
    },
    {
        path: 'reset-password',
        loadChildren: () =>
            import('./reset-password/reset-password.route').then((m) => m.resetPasswordRoute)
    }
]