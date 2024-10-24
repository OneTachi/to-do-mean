import { collections } from "./database";
import { User } from "./users";
import * as express from "express";
export const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post('/login', async(req, res) => {
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

authRouter.post('/signup', async(req, res) => {
	try {
		console.log(req.body.username);
		const dbcount = await collections?.users?.count({ username: req.body.username });
		console.log("dbcount work");
		if (dbcount !== undefined && dbcount > 0) { res.status(500).send("Sorry, username taken.");}
		else {
			console.log("identified new user");
			const newuser: User = { username: req.body.username, password: req.body.password };
			const result = await collections?.users?.insertOne(newuser);
			console.log("result came back!");
			if (result?.acknowledged) {
				req.session.save(() => {
					req.session.user = req.body.username;
				});
				res.status(201).send("Created a new user!");
				//return res.redirect('http://142.93.195.64:4200/db');
			} else { res.status(500).send("Sorry, failed to create new user."); }		
		}
	} catch (error) { console.error(error); res.status(400).send(error instanceof Error ? error : "Unknown error....");}
});

authRouter.delete('/login', async(req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error('Error destroying session:', err);
		return res.status(500).send('Internal server error');
		}

		// Redirect or send a response indicating successful logout
//		res.redirect('/'); 
  });	
});
