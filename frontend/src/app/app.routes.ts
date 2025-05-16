import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { MailSentComponent } from './auth/mail-sent/mail-sent.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MainComponent } from './main/mainPage/main.component';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { canActiveteGuard } from './auth/shared/guards/can-activete.guard';
import { CreateTicketComponent } from './ticket/seller/create-ticket/create-ticket.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'mail-sent', component: MailSentComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'my-profile', component: MyProfileComponent, canActivate:[canActiveteGuard]},
    { path: 'seller/create-ticket', component: CreateTicketComponent },
    { path: '**', redirectTo: '/main'}
];