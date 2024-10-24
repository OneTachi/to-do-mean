import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Task } from '../task';
import { TaskService } from '../task.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [TaskFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add a New Task</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-task-form
          (formSubmitted)="addTask($event)"
        ></app-task-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})
export class AddTaskComponent {
  constructor(
    private router: Router,
    private taskService: TaskService
  ) {}

  addTask(task: Task) {
	console.log(typeof(task));
    this.taskService.createTask(task).subscribe({
      next: () => {
        this.router.navigate(['/db']);
      },
      error: (error) => {
        alert('Failed to create task');
        console.error(error);
      },
    });
    this.taskService.getTasks();
  }
}
