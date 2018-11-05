import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InformationComponent } from './information.component';
import { BasicModule } from '../common/basic.module';
import { InformationMenuComponent } from './information-menu/information-menu.component';
import { InformationAboutComponent } from './information-about/information-about.component';
import { InformationPrivacyComponent } from './information-privacy/information-privacy.component';


const routes: Routes = [
  {
    path: '',
    component: InformationComponent,
    children: [
      { path: '', component: InformationMenuComponent },
      { path: 'privacy', component: InformationPrivacyComponent},
      { path: 'about', component: InformationAboutComponent },
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
    InformationComponent,
    InformationMenuComponent,
    InformationAboutComponent,
    InformationPrivacyComponent
  ]
})
export class InformationModule { }
