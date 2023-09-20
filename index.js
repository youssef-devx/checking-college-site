import { config } from 'dotenv'
import CronJob from "cron"
import mailer from "nodemailer"
import cheerio from "cheerio"
import fetch from "node-fetch"

config()

// const html = await fetch("https://www.flsh.umi.ac.ma/?cat=17").then(res => res.text()).then(txt => txt)
// 		const $ = cheerio.load(html)
// 		const lastBlogPostTitle = $("#blog-entries article:first-child header h2 a").text()
// 		const lastBlogPostDescription = $("#blog-entries article:first-child .blog-entry-summary p").text()
// 		const lastBlogPostLink = $("#blog-entries article:first-child .blog-entry-readmore a").attr("href")
// 		const lastBlogPost = {
// 			title: lastBlogPostTitle,
// 			description: lastBlogPostDescription,
// 			link: lastBlogPostLink,
// 		}

// 		console.log(lastBlogPost)
const l = console.log
const job = new CronJob.CronJob(
  '0 30 * * * *',
  sendEmail,
  null,
  true,
  'Africa/Casablanca'
)
sendEmail()

async function sendEmail () {
	const html = await fetch("https://www.flsh.umi.ac.ma/?cat=17").then(res => res.text()).then(txt => txt)
	const $ = cheerio.load(html)
	const lastBlogPostTitle = $("#blog-entries article:first-child header h2 a").text()
	const lastBlogPostDescription = $("#blog-entries article:first-child .blog-entry-summary p").text()
	const lastBlogPostLink = $("#blog-entries article:first-child .blog-entry-readmore a").attr("href")
	const lastBlogPost = {
		title: lastBlogPostTitle,
		description: lastBlogPostDescription,
		link: lastBlogPostLink,
	}

	var transporter = mailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: process.env.NODEMAILER_USER,
	    pass: process.env.NODEMAILER_PASSWORD
	  }
	})

	var mailOptions = {
	  from: process.env.MY_EMAIL,
	  to: process.env.RECIEVER_EMAIL,
	  subject: lastBlogPostTitle || 'gg',
	  html: `
	  	Title: <b>${lastBlogPostTitle}<b>.
	  	Description: <p>${lastBlogPostDescription}</p>.
	  	Link: <a href=${lastBlogPostLink}>click here</a>.
		`
	}

	transporter.sendMail(mailOptions, (err, info) => err ? console.log(err) : console.log("Sent", info))
}