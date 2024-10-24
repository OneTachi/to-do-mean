import { Component, effect, EventEmitter, input, Output, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../task';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
	ReactiveFormsModule, 
	MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
	MatCheckboxModule
  ],
  template: `
	<form
      class="task-form"
      autocomplete="off"
      [formGroup]="taskForm"
      (submit)="submitForm()"
    >
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput placeholder="Task Name" formControlName="task" required />
        @if (task.invalid) {
        <mat-error>Name must be at least 3 characters long.</mat-error>
        }
      </mat-form-field>
		
      <mat-label>Completed?</mat-label>
	  <mat-checkbox formControlName="completed"/>
	
      <br />
      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="taskForm.invalid"
      >
        Add
      </button>
    </form>
  `,
  styles: `
    .task-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-radio-button ~ .mat-mdc-radio-button {
      margin-left: 16px;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `,
})
export class TaskFormComponent {
	initialState = input<Task>();

	@Output()
	formValuesChanged = new EventEmitter<Task>();

	@Output()
	formSubmitted = new EventEmitter<Task>();
	
	taskForm: FormGroup;
	constructor(private formBuilder: FormBuilder) {
		this.taskForm = this.formBuilder.group({
			task: ['', [Validators.required, Validators.minLength(3)]],
			completed: [false],
		});
		effect(() => {
			this.taskForm.setValue({
				task: this.initialState()?.task || '',
				completed: this.initialState()?.completed || false,
			});
		});
	}

	get task() {
		return this.taskForm.get('task')!;
	}
	get completed() {
		return this.taskForm.get('completed')!;
	}
	submitForm() {
		this.formSubmitted.emit(this.taskForm.value as Task);
	}
}
