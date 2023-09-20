const CronJob = require("cron").CronJob
const accountSid = "AC8bcd042505b14aca659b89285501ed49"
const authToken = "a07919cd96e98f4af45f2f53a270d2e2"
// const client = require('twilio')(accountSid, authToken)
import mailer from 'nodemailer'
import cheerio from "cheerio"
const l = console.log

const job = new CronJob(
  '0 30 * * * *',
  () => {
  	const html = await fetch("https://www.flsh.umi.ac.ma/?cat=17", true).then(res => res.text()).then(text => text)
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
		    user: 'youssefboulalq@gmail.com',
		    pass: 'sblb xunw tjgt fkan'
		  }
		})

		var mailOptions = {
		  from: 'youssefboulalq@gmail.com',
		  to: 'yousseftask@gmail.com',
		  subject: lastBlogPostTitle,
		  html: `
		  	Title: <b>${lastBlogPostTitle}<b>.
		  	Description: <p>${lastBlogPostDescription}</p>.
		  	Link: <a href=${lastBlogPostLink}>click here</a>.
			`
		}

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error)
		  } else {
		    console.log('Email sent: ' + info.response)
		  }
		})
			l(lastBlogPost)
  },
  null,
  true,
  'Africa/Casablanca'
)