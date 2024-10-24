import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router"
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  	private url = 'http://142.93.195.64:5200';
	tasks$ = signal<Task[]>([]);
	task$ = signal<Task>({} as Task); 
	

	constructor(private httpclient: HttpClient, private router:Router) { }

	private refreshTasks() {
		this.httpclient.get<Task[]>(`${this.url}/tasks`, { withCredentials: true }).subscribe({
			next: (arr) => { this.tasks$.set(arr); },
			error: (err) => { console.error("HTTP error?:", err); }
		});
		
		
	}
	// This is called IMMEDIATELY for the table
	getTasks() {
		this.refreshTasks();
		return this.tasks$();
	}

	getTask(id: string) {
		this.httpclient.get<Task>(`${this.url}/tasks/${id}`, { withCredentials: true }).subscribe(task => {
			this.task$.set(task);
			return this.task$;
		});
	}

	createTask(task: Task) {
		return this.httpclient.post(`${this.url}/tasks`, task, { responseType: 'text', withCredentials: true });
	}

	updateTask(id: string, task: Task) {
		return this.httpclient.put(`${this.url}/tasks/${id}`, task, { responseType: 'text', withCredentials: true });
	}

	deleteTask(id: string) {
		return this.httpclient.delete(`${this.url}/tasks/${id}`, { responseType: 'text', withCredentials: true });
	}
	
	signOut() {
		return this.httpclient.delete(`${this.url}/login`, {responseType: 'text', withCredentials: true}).subscribe((response) => {
			this.router.navigate(["/"]);
		});
	}
}
