import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { MailSentComponent } from './auth/components/mail-sent/mail-sent.component';
import { MyProfileComponent } from './profile/components/my-profile/my-profile.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { SignupComponent } from './auth/components/sign-up/signup.component';
import { SigninComponent } from './auth/components/sign-in/signin.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { MainComponent } from './main/components/mainPage/main.component';

import { CartComponent } from './cart/components/cart/cart.component';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { StatusPanelComponent } from './admin/components/status-panel/status-panel.component';
import { StatusPanelEditComponent } from './admin/components/status-panel-edit/status-panel-edit.component';
import { SellerDashboardComponent } from './seller/components/seller-dashboard/seller-dashboard.component';
import { CreateTicketComponent } from './seller/components/create-ticket/create-ticket.component';
import { SellerTicketsComponent } from './seller/components/seller-tickets/seller-tickets.component';
import { TicketEditComponent } from './seller/components/ticket-edit/ticket-edit.component';
import { TicketDetailComponent } from './ticket/components/ticket-detail/ticket-detail.component';
import { MyOrdersComponent } from './order/components/my-orders/my-orders.component';
import { roleGuard } from './shared/guard/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'main/:category', component: MainComponent},
    { path: 'main/:category/:id', component: TicketDetailComponent },

    { path: 'my-profile', component: MyProfileComponent, canActivate:[roleGuard],data:{roles:['user']}},
    { path: 'my-profile/cart', component: CartComponent, canActivate:[roleGuard, roleGuard],data:{roles:['user']}},

    { path: 'order/my-orders', component: MyOrdersComponent, canActivate:[roleGuard],data:{roles:['user']}},

    { path: 'sign-up', component: SignupComponent },
    { path: 'sign-in', component: SigninComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'mail-sent', component: MailSentComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },

    { path: 'seller-dashboard', component: SellerDashboardComponent, canActivate:[roleGuard],data:{roles:['seller']} },
    { path: 'seller-dashboard/create-ticket', component: CreateTicketComponent, canActivate:[roleGuard],data:{roles:['seller']} },
    { path: 'seller-dashboard/my-tickets', component:  SellerTicketsComponent, canActivate:[roleGuard],data:{roles:['seller']}},
    { path: 'seller-dashboard/my-tickets/edit', component: TicketEditComponent, canActivate:[roleGuard],data:{roles:['seller']}},
    
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate:[roleGuard],data:{roles:['admin']}},
    { path: 'admin-dashboard/status-panel', component: StatusPanelComponent, canActivate:[roleGuard],data:{roles:['admin']}},
    { path: 'admin-dashboard/status-panel/edit', component: StatusPanelEditComponent, canActivate:[roleGuard],data:{roles:['admin']}},

    { path: '**', redirectTo: '/main'}
];