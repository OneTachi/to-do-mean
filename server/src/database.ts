import * as mongodb from "mongodb";
import { Task, User } from "./users";

export const collections: {
	tasks?: mongodb.Collection<Task>;
	users?: mongodb.Collection<User>;
} = {};

export async function connectToDatabase(uri: string) {
	// Create & Connect to client
	const client = new mongodb.MongoClient(uri);
	await client.connect();
	
	// Connect to db & apply our formatting
	const db = client.db("meanStackExample");
    //await applySchemaValidation(db);
	
	// Create the array of tasks for us to send/edit/etc.
	const taskCollection = db.collection<Task>("tasks");
    collections.tasks = taskCollection;

	const userCollection = db.collection<User>("users");
	collections.users = userCollection;
	console.log("No problems!");
}

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["task", "username"],
            additionalProperties: false,
            properties: {
                _id: {},
				username: { 
					bsonType: "string",
					description: "'username' is required and is a string",
				},
                task: {
                    bsonType: "string",
                    description: "'task' is required and is a string",
                },
                completed: {
                    bsonType: "bool",
                    description: "'completed' is not required lol, it's a boolean",
				},
		    },
		},
	};

    const userSchema = {
        $userSchema: {
            bsonType: "object",
            required: ["username", "password"],
            additionalProperties: true,
            properties: {
				_id: {},
                username: {
					bsonType: "string",
					description: "'username' is required and is a string"
				},
                password: {
                    bsonType: "string",
                    description: "'password' is required and is a string",
                },
            },
        },
    };


// Apply modification to db, no data to apply? => Create it
  await db.command({
        collMod: "tasks",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("tasks", {validator: jsonSchema});
        }
		else { (console.log(error)); }
    });

  await db.command({
        collMod: "users",
        validator: userSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("users", {validator: userSchema});
        }
    });

}


