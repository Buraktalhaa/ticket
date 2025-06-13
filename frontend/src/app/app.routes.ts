import { Routes } from '@angular/router';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { CartComponent } from './pages/cart/components/cart/cart.component';
import { roleGuard } from './shared/guard/role.guard';
import { MainComponent } from './pages/main/components/mainPage/main.component';
import { TicketDetailComponent } from './pages/ticket/components/ticket-detail/ticket-detail.component';
import { MyProfileComponent } from './pages/profile/components/my-profile/my-profile.component';
import { MyOrdersComponent } from './pages/order/components/my-orders/my-orders.component';
import { SignupComponent } from './pages/auth/components/sign-up/signup.component';
import { SigninComponent } from './pages/auth/components/sign-in/signin.component';
import { ForgotPasswordComponent } from './pages/auth/components/forgot-password/forgot-password.component';
import { MailSentComponent } from './pages/auth/components/mail-sent/mail-sent.component';
import { ResetPasswordComponent } from './pages/auth/components/reset-password/reset-password.component';
import { SellerDashboardComponent } from './pages/seller/components/seller-dashboard/seller-dashboard.component';
import { CreateTicketComponent } from './pages/seller/components/create-ticket/create-ticket.component';
import { SellerTicketsComponent } from './pages/seller/components/seller-tickets/seller-tickets.component';
import { TicketEditComponent } from './pages/seller/components/ticket-edit/ticket-edit.component';
import { authGuard } from './shared/guard/auth.guard';
import { ModeratorDashboardComponent } from './pages/moderator/components/moderator-dashboard/moderator-dashboard.component';
import { ModeratorStatusPanelComponent } from './pages/moderator/components/moderator-status-panel/moderator-status-panel.component';
import { ModeratorStatusEditComponent } from './pages/moderator/components/moderator-status-edit/moderator-status-edit.component';
import { FavoritesComponent } from './pages/favorites/components/favorites/favorites.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: MainComponent },
    { path: 'main/:category', component: MainComponent},
    { path: 'main/:category/:id', component: TicketDetailComponent },

    { path: 'my-profile', component: MyProfileComponent, canActivate:[roleGuard],data:{roles:['user']}},
    { path: 'my-profile/cart', component: CartComponent, canActivate:[roleGuard, authGuard],data:{roles:['user']}},

    { path: 'favorites', component: FavoritesComponent, canActivate:[roleGuard],data:{roles:['user']}},

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
    
    { path: 'moderator-dashboard', component: ModeratorDashboardComponent, canActivate:[roleGuard],data:{roles:['moderator']}},
    { path: 'moderator-dashboard/status-panel', component: ModeratorStatusPanelComponent, canActivate:[roleGuard],data:{roles:['moderator']}},
    { path: 'moderator-dashboard/status-panel/edit', component: ModeratorStatusEditComponent, canActivate:[roleGuard],data:{roles:['moderator']}},

    { path: '**', redirectTo: '/main'}
]