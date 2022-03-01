const jobModel = require('../model/job')
const jobUtils = require('../utils/jobUtils')
const profileModel = require('../model/profile')

module.exports = {
    async index(req, res) {

        const jobs = await jobModel.get();
        const profile = await profileModel.get();
        
        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        let jobTotalHours = 0

        const updatedJobs = jobs.map((job) => {
        //aqui serão feitos os cálculos, referentes aos jobs, para
        //que sejam atualizados sempre que o get for feito no index
        
        const deadline = jobUtils.remainingDays(job)
        const status = deadline <= 0 ? 'done' : 'progress'

        //aqui somamos, de acordo com o resultado do ternário, +1 na chave progress ou done
        statusCount[status] += 1;

        jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours
        
            
        return {
            ...job,
            deadline,
            status,
            budget: jobUtils.calculateBudget(job, profile["hour-value"]) 
        } //aqui usamos spread syntax (sintaxe de espalhamento) para "espalhar" as propriedades do objeto "job" no novo objeto
    })
        //quantidade de horas que se quer trabalhar, menos a quantidade de horas/dia de cada job em progresso
        const freeHours = profile["hours-per-day"] - jobTotalHours;

        console.log('Index acessado')
        return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours }) 
        // esse formato de inserir um objeto como parametro para o res.render()
        //passa o array jobs[] que criamos acima para dentro do HTML "index"
    }
}