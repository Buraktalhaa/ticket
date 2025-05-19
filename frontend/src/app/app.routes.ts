import { Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { MailSentComponent } from './auth/mail-sent/mail-sent.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MainComponent } from './main/mainPage/main.component';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { CreateTicketComponent } from './ticket/seller/create-ticket/create-ticket.component';
import { TicketsComponent } from './ticket/user/tickets/tickets.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { canActiveteGuard } from './guards/can-activete.guard';
import { SellerTicketsComponent } from './ticket/seller/seller-tickets/seller-tickets.component';
import { TicketEditComponent } from './ticket/seller/ticket-edit/ticket-edit.component';
import { StatusPanelComponent } from './ticket/admin/status-panel/status-panel.component';
import { StatusPanelEditComponent } from './ticket/admin/status-panel-edit/status-panel-edit.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'mail-sent', component: MailSentComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'my-profile', component: MyProfileComponent, canActivate:[canActiveteGuard]},
    { path: 'create-ticket', component: CreateTicketComponent },
    { path: 'tickets', component: TicketsComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'seller/sellerTickets', component:  SellerTicketsComponent},
    { path: 'seller/tickets/edit', component: TicketEditComponent}, // TODO:
    { path: 'admin/statusPanel/tickets', component: StatusPanelComponent},
    { path: 'admin/statusPanel/tickets/edit', component: StatusPanelEditComponent},

    { path: '**', redirectTo: '/main'}
];