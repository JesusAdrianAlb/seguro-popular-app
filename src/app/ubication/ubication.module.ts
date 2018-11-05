import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CluesUbicationComponent } from './clues-ubication/clues-ubication.component';
import { BasicModule } from '../common/basic.module';
import { MaoUbicationComponent } from './mao-ubication/mao-ubication.component';
import { UbicationContainerComponent } from './ubication-container/ubication-container.component';
import { UbicationMenuComponent } from './ubication-menu/ubication-menu.component';


const routes: Routes = [
    {
      path: '',
      component: UbicationContainerComponent,
      children: [
        { path: '', component: UbicationMenuComponent },
        { path: 'mao-location', component: MaoUbicationComponent },
        { path: 'clues-location', component: CluesUbicationComponent }
      ]
    },
];

@NgModule({
  imports: [
    CommonModule,
    BasicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CluesUbicationComponent,
    MaoUbicationComponent,
    UbicationContainerComponent,
    UbicationMenuComponent
  ],
  providers: [
  ]
})
export class CluesUbicationModule { }
