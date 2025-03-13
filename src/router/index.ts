import { createRouter, createWebHistory } from 'vue-router'
import TestView from '@/views/Test.vue'
import MainView from '@/views/pages/MainPage.vue'
import TournamentView from '@/views/pages/TournamentPage.vue'
import ProfileView from '@/views/pages/ProfilePage.vue'
import EditProfileView from '@/views/pages/EditProfilePage.vue'
import WalletView from '@/views/pages/WalletPage.vue'
import ReferralsView from '@/views/pages/ReferralsPage.vue'
import ReferralsDetailsView from '@/views/pages/ReferralsDetailsPage.vue'
import DepositView from "@/views/pages/DepositPage.vue";
import WithdrawOptionsView from "@/views/pages/WithdrawOptionsPage.vue";
import WithdrawView from "@/views/pages/WithdrawPage.vue";
import DepositOptionsView from "@/views/pages/DepositOptionsPage.vue";

const routes = [
  {
    path: '/referrals',
    name: 'Referrals',
    component: ReferralsView,
  },
  {
    path: '/referrals/details',
    name: 'Referrals Details',
    component: ReferralsDetailsView,
  },
  {
    path: '/main',
    name: 'Main',
    component: MainView,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
  },
  {
    path: '/profile/edit',
    name: 'Edit Profile',
    component: EditProfileView,
  },
  {
    path: '/tournament',
    name: 'Tournament',
    component: TournamentView,
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: WalletView,
  },
  {
    path: '/deposit-options',
    name: 'Deposit Options',
    component: DepositOptionsView,
  },
  {
    path: '/deposit',
    name: 'Deposit',
    component: DepositView,
  },
  {
    path: '/withdraw-options',
    name: 'Withdraw Options',
    component: WithdrawOptionsView,
  },
  {
    path: '/withdraw',
    name: 'Withdraw',
    component: WithdrawView,
  },
  {
    path: '/',
    redirect: '/main'
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
