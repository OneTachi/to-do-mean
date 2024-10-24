import * as mongodb from "mongodb";

export interface Task {
    username: string | undefined;
	task: string;
	completed: boolean;
    _id?: mongodb.ObjectId;
}

export interface User {
	username: string;
	password: string;
	_id?: mongodb.ObjectId;
}
