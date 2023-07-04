import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'meditation',
        data: { pageTitle: 'Meditations' },
        loadChildren: () => import('./meditation/meditation.module').then(m => m.MeditationModule),
      },
      {
        path: 'meditation-session',
        data: { pageTitle: 'MeditationSessions' },
        loadChildren: () => import('./meditation-session/meditation-session.module').then(m => m.MeditationSessionModule),
      },
      {
        path: 'mood',
        data: { pageTitle: 'Moods' },
        loadChildren: () => import('./mood/mood.module').then(m => m.MoodModule),
      },
      {
        path: 'contact',
        data: { pageTitle: 'Contacts' },
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'referal',
        data: { pageTitle: 'Referals' },
        loadChildren: () => import('./referal/referal.module').then(m => m.ReferalModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'Events' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'local-resource',
        data: { pageTitle: 'LocalResources' },
        loadChildren: () => import('./local-resource/local-resource.module').then(m => m.LocalResourceModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
