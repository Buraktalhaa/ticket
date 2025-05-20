import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { MailSentComponent } from './auth/components/mail-sent/mail-sent.component';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { CreateTicketComponent } from './ticket/seller/create-ticket/create-ticket.component';
import { TicketsComponent } from './ticket/user/tickets/tickets.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { canActiveteGuard } from './guards/can-activete.guard';
import { SellerTicketsComponent } from './ticket/seller/seller-tickets/seller-tickets.component';
import { TicketEditComponent } from './ticket/seller/ticket-edit/ticket-edit.component';
import { StatusPanelComponent } from './ticket/admin/status-panel/status-panel.component';
import { StatusPanelEditComponent } from './ticket/admin/status-panel-edit/status-panel-edit.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { SigninComponent } from './auth/components/signin/signin.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { MainComponent } from './main/components/mainPage/main.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'mail-sent', component: MailSentComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'my-profile', component: MyProfileComponent, canActivate:[canActiveteGuard],data:{roles:['user']}},
    { path: 'create-ticket', component: CreateTicketComponent, canActivate:[canActiveteGuard],data:{roles:['seller']} },
    { path: 'tickets', component: TicketsComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'seller/tickets', component:  SellerTicketsComponent, canActivate:[canActiveteGuard],data:{roles:['seller']}},
    { path: 'seller/tickets/edit', component: TicketEditComponent, canActivate:[canActiveteGuard],data:{roles:['seller']}},
    { path: 'admin/statusPanel/tickets', component: StatusPanelComponent, canActivate:[canActiveteGuard],data:{roles:['admin']}},
    { path: 'admin/statusPanel/tickets/edit', component: StatusPanelEditComponent, canActivate:[canActiveteGuard],data:{roles:['admin']}},

    { path: '**', redirectTo: '/main'}
];