import { Routes } from '@angular/router';
import { TasksListComponent } from "./tasks-list/tasks-list.component";
import { AddTaskComponent } from "./add-task/add-task.component";
import { EditTaskComponent } from "./edit-task/edit-task.component";
import { AuthFormComponent } from "./auth-form/auth-form.component";

export const routes: Routes = [
	{ path: '', component: AuthFormComponent},
	{ path : 'db', component : TasksListComponent, title : "Tasks List"},
	{ path: 'db/new', component: AddTaskComponent },
	{ path: 'db/edit/:id', component: EditTaskComponent },
];
