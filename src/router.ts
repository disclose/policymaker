import { createRouter, createWebHistory, type RouteRecordRaw, type RouterHistory } from 'vue-router'

import DownloadView from '@/views/DownloadView.vue'
import DnsSecurityTxtView from '@/views/DnsSecurityTxtView.vue'
import LandingView from '@/views/LandingView.vue'
import OrganizationView from '@/views/OrganizationView.vue'
import SafeHarborView from '@/views/SafeHarborView.vue'
import SecurityTxtView from '@/views/SecurityTxtView.vue'
import SettingsView from '@/views/SettingsView.vue'
import VdpView from '@/views/VdpView.vue'
import { usePolicymaker } from '@/state/policymaker'

export const routeRecords: RouteRecordRaw[] = [
  { path: '/', component: LandingView, name: 'landing' },
  // The introduction prose lives on the landing page. Both legacy paths stay in ROUTES so the
  // static build still emits a 200 entry for them, and redirect here so inbound links resolve.
  { path: '/policymaker', redirect: '/' },
  { path: '/policymaker/introduction', redirect: '/' },
  {
    path: '/policymaker/organization',
    component: OrganizationView,
    name: 'organization',
  },
  {
    path: '/policymaker/settings',
    component: SettingsView,
    name: 'settings',
    beforeEnter: () => {
      const { validOrganizationStep } = usePolicymaker()
      return validOrganizationStep.value || '/policymaker/organization'
    },
  },
  {
    path: '/policymaker/download',
    component: DownloadView,
    beforeEnter: () => {
      const { validAll } = usePolicymaker()
      return validAll.value || '/policymaker/organization'
    },
    children: [
      { path: '', redirect: '/policymaker/download/vdp' },
      { path: 'vdp', component: VdpView, name: 'download-vdp' },
      { path: 'securitytxt', component: SecurityTxtView, name: 'download-securitytxt' },
      { path: 'dnssecuritytxt', component: DnsSecurityTxtView, name: 'download-dnssecuritytxt' },
      { path: 'safe-harbor-clause', component: SafeHarborView, name: 'download-safe-harbor' },
    ],
  },
]

export function createPolicymakerRouter(
  history: RouterHistory = createWebHistory(import.meta.env.BASE_URL),
) {
  return createRouter({
    history,
    routes: routeRecords,
    scrollBehavior: () => ({ top: 0 }),
  })
}
