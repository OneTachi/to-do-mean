import * as express from "express";
import session from "express-session";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import { User } from "./users";
export const router = express.Router();
router.use(express.json());
router.use(session({
        secret: 'some-secret',
        resave: false,
        saveUninitialized: false,
    }));
declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}
function checkAuth(req: any) {
	if (req.session.user) { return true; }
	return false;
}
router.post('/login', async(req, res) => {
    try {
        const dbuser = await collections?.users?.findOne({ username: req.body.username });
        if (dbuser !== null && dbuser !== undefined && dbuser.password === req.body.password) {
            req.session.user = req.body.username;
            console.log(req.session);
            res.status(200).send({message: "Signed in!"});
            //return res.redirect('http://142.93.195.64:4200/db');
        } else { res.status(403).send("Incorrect Credentials"); }
    } catch (error) { res.status(404).send(`Failed to find user.`); }
});

router.post('/signup', async(req, res) => {
    try {
        const dbcount = await collections?.users?.count({ username: req.body.username });
        if (dbcount !== undefined && dbcount > 0) { res.status(500).send("Sorry, username taken.");}
        else {
            const newuser: User = { username: req.body.username, password: req.body.password };
            const result = await collections?.users?.insertOne(newuser);
            if (result?.acknowledged) {
                req.session.user = req.body.username;
                res.status(201).send({message: "Created a new user!"});
                //return res.redirect('http://142.93.195.64:4200/db');
            } else { res.status(500).send("Sorry, failed to create new user."); }
        }
    } catch (error) { console.error(error); res.status(400).send(error instanceof Error ? error : "Unknown error....");}
});

router.delete('/login', async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
			return res.status(500).send('Internal server error');
        }

        // Redirect or send a response indicating successful logout
      return res.status(200).send("Logged out!"); 
  });
});

router.get("/tasks", async (req, res) => {	
//	console.log("Here ye:");
//	console.log(req.session);
	if (checkAuth(req)) { 
	try {
		var tasks = await collections?.tasks?.find({ username: req.session.user }).toArray();	
		// Remove username from every object
		if (tasks !== undefined) { // Might break something?
			tasks.forEach((obj) => {
				delete obj.username;
			});
		}
		res.status(200).send(tasks);
	} catch (error) {
		res.status(500).send(error instanceof Error ? error.message : "Sorry, unkown error.");	
	}
	} else {res.status(403).send("Not logged in.");}
});

router.get("/tasks/:id", async (req, res) => {
	if (!checkAuth(req)) { res.status(403).send("Not logged in."); return; }
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const task = await collections?.tasks?.findOne(query);
		
        if (task) {
			// Remove username 
			delete task.username;
            res.status(200).send(task);
        } else {
            res.status(404).send(`Failed to find task: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find tasks: ID ${req?.params?.id}`);
    }
});

router.post("/tasks", async (req, res) => {
	if (!checkAuth(req)) { res.status(403).send("Not logged in."); return; }
	try {
		var task = req.body;
		task["username"] = req.session.user;
		const result = await collections?.tasks?.insertOne(task);

		if (result?.acknowledged) {
			res.status(201).send("Created a new task!"); return;
		} else { res.status(500).send("Sorry, failed to create new task."); }
	} catch (error) {
        	console.error(error);
			console.log("yes this one");
        	res.status(400).send(error instanceof Error ? error.message : "Unknown error....");
    	}

});

router.delete("/tasks/:id", async (req, res) => {
	if (!checkAuth(req)) { res.status(403).send("Not logged in."); }
	try {
		const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.tasks?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a task: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove task: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find task: ID ${id}`);
        }
	} catch (error) {
		console.error(error);
		res.status(400).send(error instanceof Error ? error.message : "Unknown error");
	}
});

router.put("/tasks/:id", async (req, res) => {
	if (!checkAuth(req)) { res.status(403).send("Not logged in."); }
    try {
        const id = req?.params?.id;
        var task = req.body;
		task['username'] = req.session.user;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.tasks?.updateOne(query, { $set: task });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated task!`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find the task: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update task: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
