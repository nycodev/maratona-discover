const jobModel = require('../model/job')
const jobUtils = require('../utils/jobUtils')
const profileModel = require('../model/profile')

module.exports = {
    create(req, res) {
        
            console.log('job acessado')
            return res.render("job")
    },

    async save(req, res) { 
            await jobModel.create({
                name: req.body.name,
                'daily-hours': req.body["daily-hours"],
                'total-hours': req.body["total-hours"],
                created_at: Date.now() // atribuindo data de hoje em milissegundos desde 01/01/1970
            })
            return res.redirect('/')
        
    },

    async show(req,res) {
        console.log('job edit acessado')

        const jobId = req.params.id // req.params pega os parâmetros da requisição, nesse caso puxando o ID na URl
        const jobs =  await jobModel.get()
        const job = jobs.find(job => Number(job.id) === Number(jobId)) 

        if (!job) {
            console.log('id não encontrado')
            return res.send('Job not found!')
        }

        const profile = await profileModel.get()
        job.budget = jobUtils.calculateBudget(job, profile["hour-value"])
        return res.render("job-edit", { job })
    },

    async update(req, res) {
        const jobId = req.params.id // req.params pega os parâmetros da requisição, nesse caso puxando o ID na URl

        const updatedJob = {
            name: req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"]
        }

        
        await jobModel.update(updatedJob, jobId)

        res.redirect('/job/' + jobId)
    },

    async delete(req, res) {
        const jobId = req.params.id //req.params pega os parâmetros da requisição, nesse caso puxando o ID
        
        await jobModel.delete(jobId)
        
        return res.redirect('/')
    }
}