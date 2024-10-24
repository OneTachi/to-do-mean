import { Component, OnInit, WritableSignal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Task } from '../task';
import { TaskService } from '../task.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [TaskFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Edit a Task</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-task-form
          (formSubmitted)="editTask($event)"
        ></app-task-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})

export class EditTaskComponent implements OnInit {
	task = {} as WritableSignal<Task>;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private taskService: TaskService,
	) {}

	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id');
		if (!id) {
			alert('No id provided');
		}

		this.taskService.getTask(id!);
		this.task = this.taskService.task$;
	}

  editTask(task: Task) {
    this.taskService
      .updateTask(this.task()._id || '', task)
      .subscribe({
        next: () => {
          this.router.navigate(['/db']);
        },
        error: (error) => {
          alert('Failed to update task');
          console.error(error);
        },
      });
  }
}
