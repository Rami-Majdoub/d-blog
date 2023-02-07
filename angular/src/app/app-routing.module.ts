import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostDetailsComponent } from 'src/app/components/post/post-details/post-details.component';
import { PostListComponent } from 'src/app/components/post/post-list/post-list.component';
import { PostFormComponent } from 'src/app/components/post/post-form/post-form.component';

const routes: Routes = [
	{ path: 'posts', component: PostListComponent },
	{ path: 'posts/form', component: PostFormComponent },
	{ path: 'posts/form/:id', component: PostFormComponent },
	{ path: 'posts/:id', component: PostDetailsComponent },
	
	{ path: '',   redirectTo: 'posts', pathMatch: 'full' }, // redirect to projects
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }