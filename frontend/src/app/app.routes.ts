import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { MailSentComponent } from './auth/components/mail-sent/mail-sent.component';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { canActiveteGuard } from './guard/can-activete.guard';
import { SignupComponent } from './auth/components/signup/signup.component';
import { SigninComponent } from './auth/components/signin/signin.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { MainComponent } from './main/components/mainPage/main.component';
import { TicketEditComponent } from './ticket/seller/components/ticket-edit/ticket-edit.component';
import { CreateTicketComponent } from './ticket/seller/components/create-ticket/create-ticket.component';
import { SellerTicketsComponent } from './ticket/seller/components/seller-tickets/seller-tickets.component';
import { StatusPanelComponent } from './ticket/admin/components/status-panel/status-panel.component';
import { StatusPanelEditComponent } from './ticket/admin/components/status-panel-edit/status-panel-edit.component';
import { AdminDashboardComponent } from './ticket/admin/components/admin-dashboard/admin-dashboard.component';
import { SellerDashboardComponent } from './ticket/seller/components/seller-dashboard/seller-dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'main/:category', component: MainComponent},
    { path: 'sign-up', component: SignupComponent },
    { path: 'sign-in', component: SigninComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'mail-sent', component: MailSentComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'my-profile', component: MyProfileComponent, canActivate:[canActiveteGuard],data:{roles:['user']}},
    { path: 'unauthorized', component: UnauthorizedComponent },

    { path: 'seller-dashboard', component: SellerDashboardComponent, canActivate:[canActiveteGuard],data:{roles:['seller']} },
    { path: 'seller-dashboard/create-ticket', component: CreateTicketComponent, canActivate:[canActiveteGuard],data:{roles:['seller']} },
    { path: 'seller-dashboard/my-tickets', component:  SellerTicketsComponent, canActivate:[canActiveteGuard],data:{roles:['seller']}},
    { path: 'seller-dashboard/my-tickets/edit', component: TicketEditComponent, canActivate:[canActiveteGuard],data:{roles:['seller']}},
    
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate:[canActiveteGuard],data:{roles:['admin']}},
    { path: 'admin-dashboard/status-panel', component: StatusPanelComponent, canActivate:[canActiveteGuard],data:{roles:['admin']}},
    { path: 'admin-dashboard/status-panel/edit', component: StatusPanelEditComponent, canActivate:[canActiveteGuard],data:{roles:['admin']}},

    { path: '**', redirectTo: '/main'}
];