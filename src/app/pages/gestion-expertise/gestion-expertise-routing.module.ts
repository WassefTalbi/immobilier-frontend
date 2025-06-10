import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MissionComponent } from './mission/mission.component';
import { UserComponent } from './user/user.component';
import { PowerComponent } from './power/power.component';
import { RapportComponent } from './rapport/rapport.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { MeetingComponent } from './meeting/meeting.component';
import { ExtractionComponent } from './extraction/extraction.component';
import { ConteneurComponent } from './conteneur/conteneur.component';
import { ContaminationComponent } from './contamination/contamination.component';
import { ResumeComponent } from './resume/resume.component';




const routes: Routes = [
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'mission',
    component: MissionComponent
  },
  {
    path: 'powerbi',
    component: PowerComponent
  },
  {
    path: 'rapport',
    component: RapportComponent
  },
  {
    path: 'chatbot',
    component: ChatbotComponent
  },
  {
    path: 'contamination',
    component: ContaminationComponent
  },
  {
    path: 'conteneur',
    component: ConteneurComponent
  },
  {
    path: 'extraction',
    component: ExtractionComponent
  },
  {
    path: 'meeting',
    component: MeetingComponent
  },
  {
    path: 'resume',
    component: ResumeComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionExpertiseRoutingModule { }
